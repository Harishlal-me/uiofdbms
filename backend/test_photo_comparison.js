require('dotenv').config();
const db = require('./config/db');

async function testPhotoComparisonAPI() {
    try {
        console.log('=== TESTING PHOTO COMPARISON API ===\n');

        // 1. Find a claim with match_id
        const [claims] = await db.execute('SELECT match_id FROM ItemClaims LIMIT 1');

        if (claims.length === 0) {
            console.log('❌ No claims found in database. Create a claim first.');
            process.exit(0);
        }

        const matchId = claims[0].match_id;
        console.log(`✓ Found claim with match_id: ${matchId}\n`);

        // 2. Test the getClaimByMatch API query directly
        const [result] = await db.execute(`
            SELECT 
                ic.claim_id, ic.match_id, ic.claimed_by, ic.claim_date,
                ic.proof_description, ic.proof_photo_url as owner_collection_photo,
                ic.claim_status,
                u.name as claimer_name, u.email as claimer_email,
                m.confidence_score,
                l.item_name as lost_item_name, l.description as lost_item_desc,
                f.item_name as found_item_name, f.description as found_item_desc,
                f.found_photo_url as finder_photo,
                sl.room_name as storage_location
            FROM ItemClaims ic
            JOIN Users u ON ic.claimed_by = u.user_id
            JOIN Matches m ON ic.match_id = m.match_id
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            WHERE ic.match_id = ?
        `, [matchId]);

        if (result.length === 0) {
            console.log('❌ Query returned no results');
            process.exit(1);
        }

        const claim = result[0];

        console.log('✅ API QUERY SUCCESSFUL!\n');
        console.log('📋 Claim Details:');
        console.log('  claim_id:', claim.claim_id);
        console.log('  match_id:', claim.match_id);
        console.log('  claimer_name:', claim.claimer_name);
        console.log('  claim_status:', claim.claim_status);
        console.log('  claim_date:', claim.claim_date);

        console.log('\n📸 Photo URLs:');
        console.log('  finder_photo:', claim.finder_photo || '(none)');
        console.log('  owner_collection_photo:', claim.owner_collection_photo || '(none)');

        console.log('\n📦 Item Details:');
        console.log('  found_item_name:', claim.found_item_name);
        console.log('  found_item_desc:', claim.found_item_desc);
        console.log('  storage_location:', claim.storage_location || '(none)');

        console.log('\n✅ VERIFICATION COMPLETE!');
        console.log('\n📌 Expected Frontend Display:');
        console.log('   LEFT: Finder Photo (When Found)');
        console.log('   RIGHT: Owner Collection Photo (At Pickup)');
        console.log('\n   Admin can compare both images side-by-side for damage verification.');

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    }
    process.exit(0);
}

testPhotoComparisonAPI();
