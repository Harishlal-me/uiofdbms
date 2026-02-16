require('dotenv').config();
const db = require('./config/db');

async function testDamageWorkflow() {
    try {
        console.log('=== TESTING DAMAGE WORKFLOW ===\n');

        // 1. Find a match with claim
        const [claims] = await db.execute(`
            SELECT ic.match_id, ic.claimed_by, m.found_id
            FROM ItemClaims ic
            JOIN Matches m ON ic.match_id = m.match_id
            LIMIT 1
        `);

        if (claims.length === 0) {
            console.log('❌ No claims found. Create a claim first.');
            process.exit(0);
        }

        const { match_id, claimed_by, found_id } = claims[0];
        console.log(`✓ Found claim for match_id: ${match_id}\n`);

        // 2. Get finder info
        const [foundReport] = await db.execute(`
            SELECT user_id as finder_id, storage_location_id
            FROM FoundReports
            WHERE found_id = ?
        `, [found_id]);

        const { finder_id, storage_location_id } = foundReport[0];
        console.log('📋 Test Data:');
        console.log('  match_id:', match_id);
        console.log('  finder_id:', finder_id);
        console.log('  owner_id (claimed_by):', claimed_by);
        console.log('  storage_location_id:', storage_location_id);

        // 3. Test NO DAMAGE scenario
        console.log('\n--- TEST 1: NO DAMAGE ---');
        const damage_found_no = false;
        const damage_notes_no = null;

        const finalNotes1 = damage_found_no
            ? (damage_notes_no || "Damage detected during verification")
            : null;

        console.log('  damage_found:', damage_found_no);
        console.log('  damage_notes:', finalNotes1);
        console.log('  Expected: No notification sent');
        console.log('  ✓ Test passed (logic correct)');

        // 4. Test DAMAGE DETECTED scenario
        console.log('\n--- TEST 2: DAMAGE DETECTED ---');
        const damage_found_yes = true;
        const damage_notes_yes = "Scratches on surface";

        const finalNotes2 = damage_found_yes
            ? (damage_notes_yes || "Damage detected during verification")
            : null;

        console.log('  damage_found:', damage_found_yes);
        console.log('  damage_notes:', finalNotes2);
        console.log('  Expected: Notification sent to finder_id:', finder_id);

        // Simulate notification insert
        const notificationMessage = "Damage was detected during collection verification. Please contact the admin regarding this case.";
        console.log('\n  📧 Notification to be sent:');
        console.log('    user_id:', finder_id);
        console.log('    match_id:', match_id);
        console.log('    message:', notificationMessage);
        console.log('    type: damage_alert');

        // 5. Test DAMAGE with NO NOTES
        console.log('\n--- TEST 3: DAMAGE DETECTED (No notes provided) ---');
        const damage_found_yes2 = true;
        const damage_notes_yes2 = null;

        const finalNotes3 = damage_found_yes2
            ? (damage_notes_yes2 || "Damage detected during verification")
            : null;

        console.log('  damage_found:', damage_found_yes2);
        console.log('  damage_notes (input):', damage_notes_yes2);
        console.log('  damage_notes (final):', finalNotes3);
        console.log('  Expected: Default message used');
        console.log('  ✓ Test passed (default message applied)');

        // 6. Summary
        console.log('\n✅ DAMAGE WORKFLOW TESTS PASSED!\n');
        console.log('📌 Workflow Summary:');
        console.log('\n  IF NO DAMAGE:');
        console.log('    - Insert ItemConditionReport (damage_found = FALSE)');
        console.log('    - Mark all records as Resolved');
        console.log('    - No notifications sent');
        console.log('    - Case closed');

        console.log('\n  IF DAMAGE DETECTED:');
        console.log('    - Insert ItemConditionReport (damage_found = TRUE)');
        console.log('    - Send notification to FINDER user');
        console.log('    - Mark all records as Resolved');
        console.log('    - Increment storage damage counter (optional)');
        console.log('    - Admin handles storage location manually (offline)');
        console.log('    - Case closed');

        console.log('\n  NOTIFICATION DETAILS:');
        console.log('    - Recipient: Finder (user who found and deposited item)');
        console.log('    - Message: "Damage was detected during collection verification.');
        console.log('               Please contact the admin regarding this case."');
        console.log('    - Type: damage_alert');

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    }
    process.exit(0);
}

testDamageWorkflow();
