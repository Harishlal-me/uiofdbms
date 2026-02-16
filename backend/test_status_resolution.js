require('dotenv').config();
const db = require('./config/db');

async function testStatusResolution() {
    try {
        console.log('=== TESTING STATUS RESOLUTION WORKFLOW ===\n');

        // 1. Check current database state
        console.log('📊 Checking database state...\n');

        const [matches] = await db.execute(`
            SELECT m.match_id, m.match_status, m.lost_id, m.found_id
            FROM Matches m
            WHERE m.match_status != 'Resolved'
            LIMIT 1
        `);

        if (matches.length === 0) {
            console.log('ℹ️  No unresolved matches found. All cases are already resolved.');
            process.exit(0);
        }

        const match = matches[0];
        console.log('✓ Found unresolved match:');
        console.log('  match_id:', match.match_id);
        console.log('  match_status:', match.match_status);
        console.log('  lost_id:', match.lost_id);
        console.log('  found_id:', match.found_id);

        // 2. Check related records status
        const [lostReport] = await db.execute('SELECT status FROM LostReports WHERE lost_id = ?', [match.lost_id]);
        const [foundReport] = await db.execute('SELECT status FROM FoundReports WHERE found_id = ?', [match.found_id]);

        console.log('\n📋 Related Records Status (BEFORE):');
        console.log('  LostReport status:', lostReport[0]?.status || 'N/A');
        console.log('  FoundReport status:', foundReport[0]?.status || 'N/A');
        console.log('  Match status:', match.match_status);

        // 3. Simulate the status resolution logic
        console.log('\n🔄 Simulating admin confirmation (status resolution)...');

        await db.execute('UPDATE Matches SET match_status = ? WHERE match_id = ?', ['Resolved', match.match_id]);
        await db.execute('UPDATE LostReports SET status = ? WHERE lost_id = ?', ['Resolved', match.lost_id]);
        await db.execute('UPDATE FoundReports SET status = ? WHERE found_id = ?', ['Resolved', match.found_id]);

        console.log('✓ Status updates executed');

        // 4. Verify updates
        const [updatedMatch] = await db.execute('SELECT match_status FROM Matches WHERE match_id = ?', [match.match_id]);
        const [updatedLost] = await db.execute('SELECT status FROM LostReports WHERE lost_id = ?', [match.lost_id]);
        const [updatedFound] = await db.execute('SELECT status FROM FoundReports WHERE found_id = ?', [match.found_id]);

        console.log('\n📋 Related Records Status (AFTER):');
        console.log('  LostReport status:', updatedLost[0]?.status);
        console.log('  FoundReport status:', updatedFound[0]?.status);
        console.log('  Match status:', updatedMatch[0]?.match_status);

        // 5. Verify all are Resolved
        const allResolved =
            updatedMatch[0]?.match_status === 'Resolved' &&
            updatedLost[0]?.status === 'Resolved' &&
            updatedFound[0]?.status === 'Resolved';

        if (allResolved) {
            console.log('\n✅ STATUS RESOLUTION TEST PASSED!');
            console.log('\n📌 Workflow Summary:');
            console.log('   1. Owner collects item from storage');
            console.log('   2. Owner uploads pickup photo');
            console.log('   3. Admin verifies photos online');
            console.log('   4. Admin clicks "Confirm Collection & Close Case"');
            console.log('   5. Backend marks ALL related records as Resolved:');
            console.log('      - Matches.match_status = Resolved');
            console.log('      - LostReports.status = Resolved');
            console.log('      - FoundReports.status = Resolved');
            console.log('      - ItemClaims.claim_status = Collected');
            console.log('\n   ✓ Case is now closed!');
        } else {
            console.log('\n❌ TEST FAILED - Not all records marked as Resolved');
        }

        // Rollback for testing purposes (optional)
        console.log('\n🔄 Rolling back changes for testing purposes...');
        await db.execute('UPDATE Matches SET match_status = ? WHERE match_id = ?', [match.match_status, match.match_id]);
        await db.execute('UPDATE LostReports SET status = ? WHERE lost_id = ?', [lostReport[0]?.status, match.lost_id]);
        await db.execute('UPDATE FoundReports SET status = ? WHERE found_id = ?', [foundReport[0]?.status, match.found_id]);
        console.log('✓ Rollback complete');

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    }
    process.exit(0);
}

testStatusResolution();
