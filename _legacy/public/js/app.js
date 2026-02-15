/* 
  CampusSafe - Core Application Logic (SPA Version)
  Engineered for Stability and Interactivity
*/

// --- MOCK DATA STORE ---
const mockData = {
    matches: [
        { id: 2938, lostItem: 'Silver MacBook', foundItem: 'Apple Laptop', matchScore: 94, location: 'Library / Cafeteria', date: 'Oct 25 / Oct 26', status: 'pending' },
        { id: 2939, lostItem: 'Blue Jansport', foundItem: 'Blue Backpack', matchScore: 88, location: 'Gym', date: 'Oct 26', status: 'pending' },
        { id: 2940, lostItem: 'Calculus Textbook', foundItem: 'Math Book', matchScore: 75, location: 'Room 304', date: 'Oct 24', status: 'pending' }
    ],
    lost: [
        { id: 101, name: 'Silver MacBook Pro', category: 'Electronics', location: 'Library', date: '2023-10-25', status: 'Lost' },
        { id: 102, name: 'Blue Jansport Bag', category: 'Clothing', location: 'Gym', date: '2023-10-26', status: 'Lost' },
        { id: 103, name: 'Toyota Car Keys', category: 'Keys', location: 'Parking Lot B', date: '2023-10-24', status: 'Lost' },
        { id: 104, name: 'Water Bottle (Hydro)', category: 'Other', location: 'Field', date: '2023-10-27', status: 'Lost' }
    ],
    found: [
        { id: 201, name: 'Apple Laptop', category: 'Electronics', location: 'Cafeteria', date: '2023-10-26', status: 'Found' },
        { id: 202, name: 'Blue Backpack', category: 'Clothing', location: 'Gym Locker', date: '2023-10-26', status: 'Found' },
        { id: 203, name: 'Calculus Book', category: 'Books', location: 'Hallway A', date: '2023-10-24', status: 'Found' },
        { id: 204, name: 'Black Umbrella', category: 'Other', location: 'Main Entrance', date: '2023-10-27', status: 'Found' }
    ],
    users: [
        { id: 1, name: 'John Doe', email: 'john.student@uni.edu', role: 'Student', points: 40 },
        { id: 2, name: 'Jane Smith', email: 'jane.faculty@uni.edu', role: 'Faculty', points: 150 },
        { id: 3, name: 'Admin User', email: 'admin@uni.edu', role: 'Admin', points: 0 }
    ]
};

// --- ROUTER & NAVIGATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Admin Dashboard if on admin page
    if (window.location.pathname.includes('/admin')) {
        navigateTo('matches'); // Default View

        // Attach Click Handlers to Admin Sidebar
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                navigateTo(target);
            });
        });
    }

    // Initialize Global active state for other pages
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

function navigateTo(pageId) {
    // 1. Update Sidebar Active State
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        if (link.getAttribute('data-target') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Render Content
    const container = document.getElementById('app-content');
    if (!container) return; // Not on admin page

    // Fade Out
    container.style.opacity = '0';
    container.style.transform = 'translateY(5px)';

    setTimeout(() => {
        let contentHTML = '';

        switch (pageId) {
            case 'matches':
                contentHTML = renderMatches();
                break;
            case 'lost':
                contentHTML = renderLostTable();
                break;
            case 'found':
                contentHTML = renderFoundTable();
                break;
            case 'users':
                contentHTML = renderUsersTable();
                break;
            default:
                contentHTML = renderMatches();
        }

        container.innerHTML = contentHTML;

        // Fade In
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';

        // Re-trigger animations
        if (pageId === 'matches') animateBars();

    }, 200); // Wait for fade out
}

// --- RENDER FUNCTIONS ---

function renderMatches() {
    let header = `
        <div class="section-header">
            <h1>Intelligent Matching</h1>
            <p>Review system-generated matches. Validate details before notifying users.</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
    `;

    let cards = mockData.matches.map(m => `
        <div class="glass-card" style="display: grid; grid-template-columns: 1fr 200px 1fr auto; gap: 24px; align-items: center;">
            <div style="display: flex; gap: 16px; align-items: center;">
                <div style="width: 60px; height: 60px; background: #E2E8F0; border-radius: 8px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-search text-muted"></i></div>
                <div>
                    <span class="status-chip chip-lost">Lost</span>
                    <div style="font-weight: 600; margin-top: 4px;">${m.lostItem}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${m.location}</div>
                </div>
            </div>

            <div style="text-align: center;">
                <div style="font-weight: 700; font-size: 1.25rem;">${m.matchScore}%</div>
                <div class="confidence-bar"><div class="confidence-fill" style="width: ${m.matchScore}%;"></div></div>
                <div style="font-size: 0.75rem; color: var(--success-text);">High Confidence</div>
            </div>

            <div style="display: flex; gap: 16px; align-items: center;">
                <div style="width: 60px; height: 60px; background: #E2E8F0; border-radius: 8px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-box text-muted"></i></div>
                <div>
                    <span class="status-chip chip-found">Found</span>
                    <div style="font-weight: 600; margin-top: 4px;">${m.foundItem}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${m.date}</div>
                </div>
            </div>

            <button class="btn btn-primary" onclick="openModal('verify-modal')">Verify</button>
        </div>
    `).join('');

    return header + cards + '</div>';
}

function renderLostTable() {
    return `
        <div class="section-header">
            <h1>Lost Items Registry</h1>
            <p>All items reported lost by students and faculty.</p>
        </div>
        <div class="glass-card" style="padding: 0; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: #F8FAFC; border-bottom: 1px solid var(--border);">
                    <tr>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Item</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Category</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Location</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Date</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.lost.map(item => `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 16px; font-weight: 500;">${item.name}</td>
                            <td style="padding: 16px;">${item.category}</td>
                            <td style="padding: 16px;">${item.location}</td>
                            <td style="padding: 16px;">${item.date}</td>
                            <td style="padding: 16px;"><span class="status-chip chip-lost">${item.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderFoundTable() {
    return `
        <div class="section-header">
            <h1>Found Items Registry</h1>
            <p>Items found and turned in or reported.</p>
        </div>
        <div class="glass-card" style="padding: 0; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: #F8FAFC; border-bottom: 1px solid var(--border);">
                    <tr>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Item</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Category</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Location</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Date</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.found.map(item => `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 16px; font-weight: 500;">${item.name}</td>
                            <td style="padding: 16px;">${item.category}</td>
                            <td style="padding: 16px;">${item.location}</td>
                            <td style="padding: 16px;">${item.date}</td>
                            <td style="padding: 16px;"><span class="status-chip chip-found">${item.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderUsersTable() {
    return `
        <div class="section-header">
            <h1>User Directory</h1>
            <p>Registered users and contribution points.</p>
        </div>
        <div class="glass-card" style="padding: 0; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: #F8FAFC; border-bottom: 1px solid var(--border);">
                    <tr>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Name</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Email</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Role</th>
                        <th style="padding: 16px; text-align: left; font-size: 0.85rem; color: var(--text-muted);">Points</th>
                        <th style="padding: 16px; text-align: right; font-size: 0.85rem; color: var(--text-muted);">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.users.map(user => `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 16px; font-weight: 500;">${user.name}</td>
                            <td style="padding: 16px;">${user.email}</td>
                            <td style="padding: 16px;"><span class="status-chip chip-pending" style="color:var(--text-main); border-color:var(--border); background: #F1F5F9;">${user.role}</span></td>
                            <td style="padding: 16px; font-weight: 600;">${user.points}</td>
                            <td style="padding: 16px; text-align: right;"><button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem;">Edit</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// --- UTILITIES ---

function animateBars() {
    setTimeout(() => {
        document.querySelectorAll('.confidence-fill').forEach(bar => {
            const width = bar.getAttribute('style').match(/width:\s*(\d+%)/)[1];
            bar.style.width = '0%';
            setTimeout(() => bar.style.width = width, 100);
        });
    }, 100);
}

// Global modal & toast
window.openModal = (id) => {
    document.getElementById(id)?.classList.add('active');
    document.body.style.overflow = 'hidden';
};
window.closeModal = (id) => {
    document.getElementById(id)?.classList.remove('active');
    document.body.style.overflow = '';
};
window.checkAuth = (role) => {
    const r = localStorage.getItem('userRole');
    if (!r) window.location.href = '/login';
    else if (role && r !== role) window.location.href = r === 'admin' ? '/admin' : '/dashboard';
};
window.showToast = (msg, type = 'success') => { /* existing logic */ };
