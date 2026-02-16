require('dotenv').config();
const db = require('./config/db');

async function verifyFix() {
    try {
        console.log('=== Verifying ItemClaims Schema ===\n');

        const [columns] = await db.execute('SHOW COLUMNS FROM ItemClaims');

        const hasMatchId = columns.some(col => col.Field === 'match_id');
        const hasClaimedAt = columns.some(col => col.Field === 'claimed_at');
        const hasProofDescription = columns.some(col => col.Field === 'proof_description');
        const hasProofPhotoUrl = columns.some(col => col.Field === 'proof_photo_url');
        const hasClaimedBy = columns.some(col => col.Field === 'claimed_by');

        console.log('Required columns check:');
        console.log('✓ match_id:', hasMatchId ? '✓' : '✗');
        console.log('✓ claimed_by:', hasClaimedBy ? '✓' : '✗');
        console.log('✓ proof_description:', hasProofDescription ? '✓' : '✗');
        console.log('✓ proof_photo_url:', hasProofPhotoUrl ? '✓' : '✗');
        console.log('✓ claimed_at:', hasClaimedAt ? '✓' : '✗');

        if (hasMatchId && hasClaimedAt && hasProofDescription && hasProofPhotoUrl && hasClaimedBy) {
            console.log('\n✅ Schema is correct! Ready for claim submissions.');
        } else {
            console.log('\n⚠️  Some columns are missing. Need to add them.');
        }

        console.log('\nAll columns:');
        columns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

verifyFix();
