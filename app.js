/* ==========================================================================
   EXECUTIVE DASHBOARD LOGIC - YAN 2026
   Three.js 3D Particles | Chart.js Charts | Dynamic Data Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThreeBackground();
    initDashboardData();
    initCharts();
    renderTables();
    initInteractiveEvents();
});

/* ==========================================================================
   1. DATA REPOSITORY (Chuẩn hóa 5 nghiệp vụ & Đối soát chéo 100%)
   ========================================================================== */

const DASHBOARD_DATA = {
    totalTools: 124,
    newCount: 104,
    dtCount: 20,
    dgCount: 35,
    cyCount: 89,
    
    // 12 Tháng năm 2026 + Cột Pending theo chỉ đạo người dùng (Nhiệm vụ 2)
    monthlyLabels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'Pending'],
    monthlyDistribution: [3, 30, 0, 2, 1, 6, 6, 17, 27, 22, 5, 0, 5], // Tổng = 124

    // Phân bổ Xưởng DG / CY qua 12 tháng + Pending tách New/DT (Nhiệm vụ 5 / Mục 6)
    plantsMonthly: {
        DG: {
            New: [1, 9, 0, 0, 0, 1, 2, 5, 12, 4, 0, 0, 0], // Tổng = 34
            DT:  [0, 0, 0, 0, 0, 1, 0, 0,  0, 0, 0, 0, 0]  // Tổng = 1
        }, // Tổng DG = 35
        CY: {
            New: [2, 21, 0, 2, 0, 1, 4, 10, 14, 6, 5, 0, 5], // Tổng = 70 (gồm 5 Pending)
            DT:  [0,  0, 0, 0, 1, 3, 0,  2,  1, 12, 0, 0, 0]  // Tổng = 19
        }  // Tổng CY = 89
    },

    // 9 Khách hàng chính (Nhiệm vụ 3)
    customers: [
        { name: "OP",    type: "Chính", monthly: [2, 0, 0, 2, 1, 4, 2, 2, 18, 16, 0, 0, 0], new: 31, dt: 16 }, // Tot: 47
        { name: "FC",    type: "Chính", monthly: [0, 24, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], new: 24, dt: 2 },  // Tot: 26
        { name: "CPT",   type: "Chính", monthly: [0, 0, 0, 0, 0, 0, 4, 2, 0, 1, 5, 0, 4],  new: 14, dt: 2 },  // Tot: 16 (4 Pending)
        { name: "SN",    type: "Chính", monthly: [0, 0, 0, 0, 0, 0, 0, 6, 0, 4, 0, 0, 0],  new: 10, dt: 0 },  // Tot: 10
        { name: "Mil",   type: "Chính", monthly: [0, 2, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 1],  new: 9,  dt: 0 },  // Tot: 9 (1 Pending)
        { name: "Lexy",  type: "Chính", monthly: [0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0],  new: 8,  dt: 0 },  // Tot: 8
        { name: "KA",    type: "Chính", monthly: [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  new: 4,  dt: 0 },  // Tot: 4
        { name: "Vexos", type: "Chính", monthly: [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],  new: 3,  dt: 0 },  // Tot: 3
        { name: "SEB",   type: "Chính", monthly: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  new: 1,  dt: 0 }   // Tot: 1
    ],

    // 10 Giai đoạn Dự án bóc tách theo Khách hàng (Nhiệm vụ 4)
    stages: ["DFM", "Design", "Processing", "T0", "T1", "ESB", "EB", "QB", "PP", "MP"],
    customerStages: [
        { name: "OP",    stages: [0, 0, 25, 0, 11, 0, 6, 0, 0, 5],  projects: "TR2200637/TR2200638, TR2400035, TR25001161, TR2500579, TR2500634, TR2500852, TR2600391, TR2600457, TR2600458~486, TR2600462, TR2600465, TR2600492, TR2600501, TR2600538, TR2601083, TR2601105, TR2601296" },
        { name: "FC",    stages: [0, 0, 0,  0, 0,  0, 0, 0, 0, 26], projects: "SV061" },
        { name: "CPT",   stages: [9, 0, 1,  0, 2,  0, 4, 0, 0, 0],  projects: "ESF5003, PBLPS01, PBLSV715, TR2601146, TR2601450" },
        { name: "SN",    stages: [0, 0, 4,  0, 6,  0, 0, 0, 0, 0],  projects: "CFP150, GP160" },
        { name: "Mil",   stages: [1, 0, 1,  0, 2,  0, 0, 3, 0, 2],  projects: "Q20365, Q20473, Q20535, Q20543, Q20553, Q20554" },
        { name: "Lexy",  stages: [0, 0, 8,  0, 0,  0, 0, 0, 0, 0],  projects: "KCL LA341" },
        { name: "KA",    stages: [0, 0, 0,  0, 0,  0, 4, 0, 0, 0],  projects: "D056" },
        { name: "Vexos", stages: [0, 0, 0,  0, 3,  0, 0, 0, 0, 0],  projects: "C0058168-01" },
        { name: "SEB",   stages: [0, 0, 0,  0, 0,  0, 0, 0, 0, 1],  projects: "FAN04" }
    ]
};

/* ==========================================================================
   2. THREE.JS 3D PARTICLE VISUALIZER (Interactive Background)
   ========================================================================== */

function initThreeBackground() {
    const canvas = document.getElementById('bg-3d');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create 3D Holographic Network Sphere
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x6366f1); // Indigo
    const color2 = new THREE.Color(0x06b6d4); // Cyan
    const color3 = new THREE.Color(0xa855f7); // Purple

    for (let i = 0; i < particleCount; i++) {
        // Spherical distribution
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 38 + (Math.random() - 0.5) * 14;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Gradient Colors
        const mixedColor = color1.clone().lerp(Math.random() > 0.5 ? color2 : color3, Math.random());
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
        size: 1.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add Wireframe Dual Hub Nodes (Representing DG & CY plants)
    const hubGeometry = new THREE.IcosahedronGeometry(22, 1);
    const hubMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f46e5,
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });
    const hubMesh = new THREE.Mesh(hubGeometry, hubMaterial);
    scene.add(hubMesh);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.03;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.03;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        particles.rotation.y += 0.0015;
        particles.rotation.x += 0.0008;

        hubMesh.rotation.y -= 0.002;
        hubMesh.rotation.z += 0.001;

        particles.position.x = targetX;
        particles.position.y = -targetY;
        hubMesh.position.x = targetX;
        hubMesh.position.y = -targetY;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ==========================================================================
   3. INITIALIZE DASHBOARD STATS & KPI COUNTERS
   ========================================================================== */

function initDashboardData() {
    document.getElementById('kpi-total-tools').textContent = DASHBOARD_DATA.totalTools;
    document.getElementById('kpi-new-count').textContent = DASHBOARD_DATA.newCount;
    document.getElementById('kpi-dt-count').textContent = DASHBOARD_DATA.dtCount;
    document.getElementById('kpi-dg-count').textContent = DASHBOARD_DATA.dgCount;
    document.getElementById('kpi-cy-count').textContent = DASHBOARD_DATA.cyCount;

    const newPercent = Math.round((DASHBOARD_DATA.newCount / DASHBOARD_DATA.totalTools) * 100);
    const dtPercent = 100 - newPercent;
    document.getElementById('progress-new-fill').style.width = `${newPercent}%`;
    document.getElementById('progress-dt-fill').style.width = `${dtPercent}%`;
}

/* ==========================================================================
   4. CHART.JS VISUALIZATIONS
   ========================================================================== */

let chartMonthlyTrend, chartPlantTypes, chartPlantsComparison, chartStagesProgress;

function initCharts() {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    // Chart 1: Monthly Kick-off Trend 2026 (Spline Area Chart)
    const ctxMonthly = document.getElementById('chart-monthly-trend')?.getContext('2d');
    if (ctxMonthly) {
        const gradientMonthly = ctxMonthly.createLinearGradient(0, 0, 0, 260);
        gradientMonthly.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
        gradientMonthly.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

        chartMonthlyTrend = new Chart(ctxMonthly, {
            type: 'line',
            data: {
                labels: DASHBOARD_DATA.monthlyLabels,
                datasets: [{
                    label: 'Số lượng khuôn Kick-off',
                    data: DASHBOARD_DATA.monthlyDistribution,
                    borderColor: '#06b6d4',
                    borderWidth: 3,
                    backgroundColor: gradientMonthly,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#06b6d4',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#38bdf8',
                        borderColor: 'rgba(6, 182, 212, 0.3)',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: (ctx) => ` Mở: ${ctx.parsed.y} khuôn`
                        }
                    }
                },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.04)' } },
                    y: { 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        beginAtZero: true,
                        ticks: { stepSize: 5 }
                    }
                }
            }
        });
    }

    // Chart 2: Phân bổ Xưởng DG / CY & Loại khuôn (Donut Chart)
    const ctxPlantTypes = document.getElementById('chart-plant-types')?.getContext('2d');
    if (ctxPlantTypes) {
        const dgNewTot = DASHBOARD_DATA.plantsMonthly.DG.New.reduce((a, b) => a + b, 0);
        const dgDtTot = DASHBOARD_DATA.plantsMonthly.DG.DT.reduce((a, b) => a + b, 0);
        const cyNewTot = DASHBOARD_DATA.plantsMonthly.CY.New.reduce((a, b) => a + b, 0);
        const cyDtTot = DASHBOARD_DATA.plantsMonthly.CY.DT.reduce((a, b) => a + b, 0);

        chartPlantTypes = new Chart(ctxPlantTypes, {
            type: 'doughnut',
            data: {
                labels: ['DG - New (Khuôn mới)', 'DG - DT (Khuôn copy)', 'CY - New (Khuôn mới)', 'CY - DT (Khuôn copy)'],
                datasets: [{
                    data: [dgNewTot, dgDtTot, cyNewTot, cyDtTot],
                    backgroundColor: ['#06b6d4', '#0284c7', '#a855f7', '#7c3aed'],
                    borderWidth: 2,
                    borderColor: '#0f172a',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, padding: 12, font: { size: 11 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.parsed} khuôn`
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    // Chart 3: So sánh mở khuôn Xưởng DG vs CY qua 12 tháng (Grouped Bar Chart)
    const ctxComparison = document.getElementById('chart-plants-comparison')?.getContext('2d');
    if (ctxComparison) {
        const dgTotalsByMonth = DASHBOARD_DATA.monthlyDistribution.map((_, i) => 
            DASHBOARD_DATA.plantsMonthly.DG.New[i] + DASHBOARD_DATA.plantsMonthly.DG.DT[i]
        );
        const cyTotalsByMonth = DASHBOARD_DATA.monthlyDistribution.map((_, i) => 
            DASHBOARD_DATA.plantsMonthly.CY.New[i] + DASHBOARD_DATA.plantsMonthly.CY.DT[i]
        );

        chartPlantsComparison = new Chart(ctxComparison, {
            type: 'bar',
            data: {
                labels: DASHBOARD_DATA.monthlyLabels,
                datasets: [
                    {
                        label: 'Xưởng DG (Dong Guan)',
                        data: dgTotalsByMonth,
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    },
                    {
                        label: 'Xưởng CY (Chao Yue)',
                        data: cyTotalsByMonth,
                        backgroundColor: '#f59e0b',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12 } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} khuôn`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Chart 4: Vòng đời 10 Giai đoạn Dự án (Bar Chart)
    const ctxStages = document.getElementById('chart-stages-progress')?.getContext('2d');
    if (ctxStages) {
        // Aggregate totals for each stage across customers
        const stageTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        DASHBOARD_DATA.customerStages.forEach(cs => {
            cs.stages.forEach((cnt, idx) => {
                stageTotals[idx] += cnt;
            });
        });

        chartStagesProgress = new Chart(ctxStages, {
            type: 'bar',
            data: {
                labels: DASHBOARD_DATA.stages,
                datasets: [{
                    label: 'Số lượng Dự án đang thực hiện',
                    data: stageTotals,
                    backgroundColor: [
                        '#6366f1', '#818cf8', '#06b6d4', '#14b8a6', 
                        '#10b981', '#84cc16', '#eab308', '#f59e0b', 
                        '#f97316', '#ef4444'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` Giai đoạn ${ctx.label}: ${ctx.parsed.y} dự án`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        beginAtZero: true,
                        ticks: { stepSize: 2 }
                    }
                }
            }
        });
    }
}

/* ==========================================================================
   5. RENDER INTERACTIVE DATA TABLES
   ========================================================================== */

function renderTables() {
    renderCustomersTable();
    renderPlantsTable();
    renderStagesTable();
}

// Tab 1: Ma trận Khách hàng x Tháng (Nhiệm vụ 3)
function renderCustomersTable() {
    const tbody = document.getElementById('tbody-customers');
    const tfoot = document.getElementById('tfoot-customers');
    if (!tbody || !tfoot) return;

    tbody.innerHTML = '';
    const monthlySum = new Array(DASHBOARD_DATA.monthlyLabels.length).fill(0);
    let totalAll = 0, totalNewAll = 0, totalDtAll = 0;

    DASHBOARD_DATA.customers.forEach(cust => {
        const rowTotal = cust.monthly.reduce((a, b) => a + b, 0);
        totalAll += rowTotal;
        totalNewAll += cust.new;
        totalDtAll += cust.dt;

        cust.monthly.forEach((val, i) => { monthlySum[i] += val; });

        const isSub = cust.type === 'Bổ sung';
        const badgeClass = isSub ? 'badge-sub' : 'badge-main';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="sticky-col">${cust.name}</td>
            <td><span class="badge ${badgeClass}">${cust.type}</span></td>
            ${cust.monthly.map(v => `<td>${v}</td>`).join('')}
            <td class="highlight-col">${rowTotal}</td>
            <td class="text-cyan">${cust.new}</td>
            <td class="text-purple">${cust.dt}</td>
        `;
        tbody.appendChild(tr);
    });

    // Foot row (Totals)
    tfoot.innerHTML = `
        <tr>
            <td class="sticky-col">TỔNG CỘNG HỆ THỐNG</td>
            <td><strong>${DASHBOARD_DATA.customers.length} KH</strong></td>
            ${monthlySum.map(v => `<td><strong>${v}</strong></td>`).join('')}
            <td class="highlight-col"><strong>${totalAll}</strong></td>
            <td class="text-cyan"><strong>${totalNewAll}</strong></td>
            <td class="text-purple"><strong>${totalDtAll}</strong></td>
        </tr>
    `;
}

// Tab 2: Phân bổ Xưởng DG / CY & Tách New / DT (Nhiệm vụ 5 / Mục 6)
function renderPlantsTable() {
    const tbody = document.getElementById('tbody-plants');
    const tfoot = document.getElementById('tfoot-plants');
    if (!tbody || !tfoot) return;

    tbody.innerHTML = '';
    const p = DASHBOARD_DATA.plantsMonthly;

    // DG Rows
    const dgNewTotal = p.DG.New.reduce((a, b) => a + b, 0);
    const dgDtTotal = p.DG.DT.reduce((a, b) => a + b, 0);
    const dgTotal = dgNewTotal + dgDtTotal;

    // CY Rows
    const cyNewTotal = p.CY.New.reduce((a, b) => a + b, 0);
    const cyDtTotal = p.CY.DT.reduce((a, b) => a + b, 0);
    const cyTotal = cyNewTotal + cyDtTotal;

    const grandTotal = dgTotal + cyTotal;

    tbody.innerHTML = `
        <!-- Xưởng DG -->
        <tr>
            <td class="sticky-col" rowspan="3"><strong>DG (Dong Guan)</strong></td>
            <td><span class="badge badge-main">New (Mới)</span></td>
            ${p.DG.New.map(v => `<td>${v}</td>`).join('')}
            <td class="highlight-col">${dgNewTotal}</td>
            <td>${Math.round((dgNewTotal / grandTotal) * 100)}%</td>
        </tr>
        <tr>
            <td><span class="badge badge-purple">DT (Copy)</span></td>
            ${p.DG.DT.map(v => `<td>${v}</td>`).join('')}
            <td class="highlight-col">${dgDtTotal}</td>
            <td>${Math.round((dgDtTotal / grandTotal) * 100)}%</td>
        </tr>
        <tr style="background: rgba(16, 185, 129, 0.08);">
            <td><strong class="text-emerald">Tổng DG</strong></td>
            ${p.DG.New.map((v, i) => `<td><strong class="text-emerald">${v + p.DG.DT[i]}</strong></td>`).join('')}
            <td class="highlight-col"><strong class="text-emerald">${dgTotal}</strong></td>
            <td><strong class="text-emerald">${Math.round((dgTotal / grandTotal) * 100)}%</strong></td>
        </tr>

        <!-- Xưởng CY -->
        <tr>
            <td class="sticky-col" rowspan="3"><strong>CY (Chao Yue)</strong></td>
            <td><span class="badge badge-main">New (Mới)</span></td>
            ${p.CY.New.map(v => `<td>${v}</td>`).join('')}
            <td class="highlight-col">${cyNewTotal}</td>
            <td>${Math.round((cyNewTotal / grandTotal) * 100)}%</td>
        </tr>
        <tr>
            <td><span class="badge badge-purple">DT (Copy)</span></td>
            ${p.CY.DT.map(v => `<td>${v}</td>`).join('')}
            <td class="highlight-col">${cyDtTotal}</td>
            <td>${Math.round((cyDtTotal / grandTotal) * 100)}%</td>
        </tr>
        <tr style="background: rgba(245, 158, 11, 0.08);">
            <td><strong class="text-amber">Tổng CY</strong></td>
            ${p.CY.New.map((v, i) => `<td><strong class="text-amber">${v + p.CY.DT[i]}</strong></td>`).join('')}
            <td class="highlight-col"><strong class="text-amber">${cyTotal}</strong></td>
            <td><strong class="text-amber">${Math.round((cyTotal / grandTotal) * 100)}%</strong></td>
        </tr>
    `;

    // Foot: Grand Total per Month
    tfoot.innerHTML = `
        <tr>
            <td class="sticky-col" colspan="2">TỔNG TOÀN BỘ 2 XƯỞNG</td>
            ${DASHBOARD_DATA.monthlyDistribution.map(v => `<td><strong>${v}</strong></td>`).join('')}
            <td class="highlight-col"><strong>${grandTotal}</strong></td>
            <td><strong>100%</strong></td>
        </tr>
    `;
}

// Tab 3: Theo dõi 10 Giai đoạn Dự án (Nhiệm vụ 4)
function renderStagesTable() {
    const tbody = document.getElementById('tbody-stages');
    if (!tbody) return;

    tbody.innerHTML = '';
    DASHBOARD_DATA.customerStages.forEach(cs => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="sticky-col">${cs.name}</td>
            ${cs.stages.map(st => `<td>${st > 0 ? `<span class="badge badge-main">${st}</span>` : `<span class="text-dim">-</span>`}</td>`).join('')}
            <td style="text-align: left; font-size: 0.8rem; font-family: var(--font-sans); color: var(--text-muted);">${cs.projects}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* ==========================================================================
   6. INTERACTIVE EVENTS (Tabs, Search, Presentation Mode, Filters)
   ========================================================================== */

function initInteractiveEvents() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tc => {
                tc.classList.remove('active');
            });
            document.getElementById(targetTab)?.classList.add('active');
        });
    });

    // Table Search Filter
    const searchInput = document.getElementById('table-search');
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;

        const rows = activeTab.querySelectorAll('tbody tr');
        rows.forEach(r => {
            const text = r.textContent.toLowerCase();
            r.style.display = text.includes(query) ? '' : 'none';
        });
    });

    // Presentation Fullscreen Mode
    const btnPres = document.getElementById('btn-presentation');
    btnPres?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn("Fullscreen request error:", err);
            });
            document.body.classList.add('presentation-mode');
            btnPres.innerHTML = '<i class="fa-solid fa-compress"></i> <span>Thu nhỏ</span>';
        } else {
            document.exitFullscreen();
            document.body.classList.remove('presentation-mode');
            btnPres.innerHTML = '<i class="fa-solid fa-expand"></i> <span>Thuyết trình</span>';
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            document.body.classList.remove('presentation-mode');
            if (btnPres) btnPres.innerHTML = '<i class="fa-solid fa-expand"></i> <span>Thuyết trình</span>';
        }
    });

    // Export / Print Report
    const btnExport = document.getElementById('btn-export');
    btnExport?.addEventListener('click', () => {
        window.print();
    });

    // Plant Filter Dropdown Event
    const filterPlant = document.getElementById('filter-plant');
    filterPlant?.addEventListener('change', (e) => {
        const plant = e.target.value;
        if (plant === 'ALL') {
            document.getElementById('kpi-total-tools').textContent = DASHBOARD_DATA.totalTools;
        } else if (plant === 'DG') {
            document.getElementById('kpi-total-tools').textContent = DASHBOARD_DATA.dgCount;
        } else if (plant === 'CY') {
            document.getElementById('kpi-total-tools').textContent = DASHBOARD_DATA.cyCount;
        }
    });

    // Tooling Type Filter Dropdown Event
    const filterType = document.getElementById('filter-type');
    filterType?.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'ALL') {
            document.getElementById('kpi-total-tools').textContent = DASHBOARD_DATA.totalTools;
        } else if (type === 'New') {
            document.getElementById('kpi-total-tools').textContent = DASHBOARD_DATA.newCount;
        } else if (type === 'DT') {
            document.getElementById('kpi-total-tools').textContent = DASHBOARD_DATA.dtCount;
        }
    });
}
