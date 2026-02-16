
const db = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Get All Resolved Cases for Admin Report
exports.getResolvedCases = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                m.match_id, m.match_status, m.verified_at, m.created_at,
                m.confidence_score,
                
                ic.claim_id, ic.claim_date, ic.claim_status, ic.proof_description,
                ic.proof_photo_url as owner_pickup_photo,
                
                cond.condition_id, cond.collection_date, cond.collection_photo_url, 
                cond.damage_found, cond.damage_notes,
                
                l.item_name as lost_item, l.description as lost_desc,
                f.item_name as found_item, f.description as found_desc, f.found_photo_url as finder_photo,
                
                u_finder.name as finder_name, u_finder.email as finder_email,
                u_loser.name as loser_name, u_loser.email as loser_email,
                
                sl.room_name as storage_location,
                admin.name as verified_by_admin
                
            FROM Matches m
            JOIN ItemClaims ic ON m.match_id = ic.match_id
            LEFT JOIN ItemConditionReport cond ON m.match_id = cond.match_id
            
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            
            LEFT JOIN Users u_finder ON f.user_id = u_finder.user_id
            LEFT JOIN Users u_loser ON l.user_id = u_loser.user_id
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            LEFT JOIN Users admin ON cond.verified_by = admin.user_id
            
            WHERE m.match_status = 'Resolved'
            ORDER BY cond.collection_date DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Get Resolved Cases Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Generate PDF for a Case
exports.generateCasePDF = async (req, res) => {
    try {
        const { id } = req.params; // match_id reported as case id

        const [rows] = await db.execute(`
            SELECT 
                m.match_id, m.match_status, m.verified_at, m.created_at,
                
                ic.claim_id, ic.claim_date, ic.claim_status, ic.proof_description,
                ic.proof_photo_url as owner_pickup_photo,
                
                cond.condition_id, cond.collection_date, cond.collection_photo_url, 
                cond.damage_found, cond.damage_notes,
                
                l.item_name as lost_item, l.description as lost_desc, l.lost_date, l.photo_url as lost_photo,
                f.item_name as found_item, f.description as found_desc, f.found_date, f.found_photo_url as finder_photo,
                
                u_finder.name as finder_name, u_finder.email as finder_email,
                u_loser.name as loser_name, u_loser.email as loser_email,
                
                sl.room_name as storage_location,
                admin.name as verified_by_admin
                
            FROM Matches m
            JOIN ItemClaims ic ON m.match_id = ic.match_id
            LEFT JOIN ItemConditionReport cond ON m.match_id = cond.match_id
            
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            
            LEFT JOIN Users u_finder ON f.user_id = u_finder.user_id
            LEFT JOIN Users u_loser ON l.user_id = u_loser.user_id
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            LEFT JOIN Users admin ON cond.verified_by = admin.user_id
            
            WHERE m.match_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Case not found' });
        }


        const report = rows[0];
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
            bufferPages: true
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=CampusSafe_Case_${id}_Report.pdf`);

        // Pipe to response
        doc.pipe(res);

        // ============================================
        // HEADER SECTION
        // ============================================
        doc.fontSize(28).fillColor('#1e40af').font('Helvetica-Bold')
            .text('CampusSafe', { align: 'center' });

        doc.fontSize(11).fillColor('#64748b').font('Helvetica')
            .text('SRM Institute of Science and Technology', { align: 'center' });

        doc.fontSize(10).fillColor('#94a3b8')
            .text('Kattankulathur Campus', { align: 'center' });

        doc.moveDown(0.5);
        doc.fontSize(18).fillColor('#0f172a').font('Helvetica-Bold')
            .text('Lost & Found Case Report', { align: 'center' });

        doc.moveDown(0.3);
        doc.fontSize(9).fillColor('#64748b').font('Helvetica')
            .text(`Generated on: ${new Date().toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            })}`, { align: 'center' });

        doc.moveDown(1);

        // Horizontal line
        doc.strokeColor('#cbd5e1').lineWidth(1.5)
            .moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.5);

        // ============================================
        // SECTION 1: CASE INFORMATION
        // ============================================
        doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold')
            .text('CASE INFORMATION');
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor('#0f172a').font('Helvetica');
        const caseInfoY = doc.y;

        doc.text(`Case ID: #${report.match_id}`, 50, caseInfoY);
        doc.text(`Status: ${report.match_status}`, 300, caseInfoY);

        doc.text(`Date Closed: ${report.collection_date ? new Date(report.collection_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}`, 50, caseInfoY + 15);
        doc.text(`Verified By: ${report.verified_by_admin || 'System Admin'}`, 300, caseInfoY + 15);

        doc.moveDown(2);

        // ============================================
        // SECTION 2: ITEM DETAILS
        // ============================================
        doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold')
            .text('ITEM DETAILS');
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor('#0f172a').font('Helvetica-Bold');
        doc.text('Lost Item:');
        doc.font('Helvetica').fillColor('#334155');
        doc.text(`  Name: ${report.lost_item || 'N/A'}`);
        doc.text(`  Description: ${report.lost_desc || 'No description provided'}`);
        doc.text(`  Owner: ${report.loser_name || 'Unknown'} (${report.loser_email || 'N/A'})`);

        doc.moveDown(0.5);

        doc.font('Helvetica-Bold').fillColor('#0f172a');
        doc.text('Found Item:');
        doc.font('Helvetica').fillColor('#334155');
        doc.text(`  Name: ${report.found_item || 'N/A'}`);
        doc.text(`  Description: ${report.found_desc || 'No description provided'}`);
        doc.text(`  Finder: ${report.finder_name || 'Unknown'} (${report.finder_email || 'N/A'})`);
        doc.text(`  Storage Location: ${report.storage_location || 'Not specified'}`);

        doc.moveDown(1.5);

        // ============================================
        // SECTION 3: PROCESS TIMELINE
        // ============================================
        doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold')
            .text('PROCESS TIMELINE');
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor('#334155').font('Helvetica');
        const timeline = [
            { step: '1. Lost Item Reported', date: report.lost_date },
            { step: '2. Found Item Submitted', date: report.found_date },
            { step: '3. Match Generated', date: report.created_at },
            { step: '4. Admin Verified Match', date: report.verified_at },
            { step: '5. Item Claimed by Owner', date: report.claim_date },
            { step: '6. Condition Verified', date: report.collection_date },
            { step: '7. Case Closed', date: report.collection_date }
        ];

        timeline.forEach(item => {
            const dateStr = item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
            doc.text(`${item.step}`, 60, doc.y, { continued: true, width: 300 });
            doc.fillColor('#64748b').text(` — ${dateStr}`, { align: 'left' });
            doc.fillColor('#334155');
        });

        doc.moveDown(1.5);

        // ============================================
        // SECTION 4: CLAIM & HANDOVER DETAILS
        // ============================================
        doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold')
            .text('CLAIM & HANDOVER DETAILS');
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor('#0f172a').font('Helvetica');
        doc.text(`Claimed By: ${report.loser_name || 'N/A'}`);
        doc.text(`Claim Date: ${report.claim_date ? new Date(report.claim_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}`);
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').text('Proof Description:');
        doc.font('Helvetica').fillColor('#334155');
        doc.text(`"${report.proof_description || 'No proof description provided'}"`, { indent: 20, width: 495 });

        doc.moveDown(1.5);

        // ============================================
        // SECTION 5: ITEM CONDITION CHECK
        // ============================================
        doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold')
            .text('ITEM CONDITION VERIFICATION');
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor('#0f172a').font('Helvetica');
        const damageStatus = report.damage_found ? 'YES' : 'NO';
        const damageColor = report.damage_found ? '#dc2626' : '#16a34a';

        doc.text('Damage Detected: ', { continued: true });
        doc.fillColor(damageColor).font('Helvetica-Bold').text(damageStatus);
        doc.fillColor('#0f172a').font('Helvetica');

        if (report.damage_found) {
            doc.moveDown(0.3);
            doc.font('Helvetica-Bold').text('Admin Notes:');
            doc.font('Helvetica').fillColor('#334155');
            doc.text(`${report.damage_notes || 'Damage detected during verification'}`, { indent: 20 });
            doc.moveDown(0.3);
            doc.fillColor('#0f172a');
            doc.text('Action Taken: Finder notified via system notification. Storage location staff informed manually.');
        } else {
            doc.moveDown(0.3);
            doc.text('Admin Remarks: Item returned in good condition.');
            doc.text('Action Taken: Case closed successfully with no issues reported.');
        }

        doc.moveDown(1.5);

        // ============================================
        // SECTION 6: PHOTO EVIDENCE
        // ============================================
        doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold')
            .text('PHOTO EVIDENCE');
        doc.moveDown(0.5);

        doc.fontSize(9).fillColor('#64748b').font('Helvetica');
        doc.text('Finder Photo: Uploaded when item was found');
        doc.text('Owner Pickup Photo: Uploaded during claim submission');
        doc.fillColor('#334155').fontSize(8);
        doc.text('(Photos stored in system database for verification purposes)');

        doc.moveDown(1.5);

        // ============================================
        // SECTION 7: SYSTEM SUMMARY
        // ============================================
        doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold')
            .text('SYSTEM SUMMARY');
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor('#334155').font('Helvetica');
        doc.text('This case was successfully matched using the CampusSafe Lost & Found system. The match was verified by an administrator, ownership was confirmed through the claim process, and the item was returned to the rightful owner. The case has been closed and archived for institutional records.', { align: 'justify', width: 495 });

        doc.moveDown(2);

        // ============================================
        // FOOTER
        // ============================================
        doc.strokeColor('#cbd5e1').lineWidth(1)
            .moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);

        doc.fontSize(8).fillColor('#94a3b8').font('Helvetica');
        doc.text('*** System Generated Report ***', { align: 'center' });
        doc.text('CampusSafe Lost & Found Platform', { align: 'center' });
        doc.text('No physical signature required', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(7).fillColor('#cbd5e1');
        doc.text('This is an official document generated by the CampusSafe system for institutional record-keeping purposes.', { align: 'center' });

        doc.end();

    } catch (error) {
        console.error("Generate PDF Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server Error generating PDF', error: error.message });
        }
    }
};
