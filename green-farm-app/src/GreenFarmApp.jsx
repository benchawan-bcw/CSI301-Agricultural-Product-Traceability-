import './GreenFarmApp.css';
import React, { useState } from 'react';
import {
  Search,
  QrCode,
  ShieldCheck,
  Truck,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  UserCheck,
  PlusCircle,
  XCircle,
  Award,
  Send,
  User,
  Activity
} from 'lucide-react';

// ==========================================
// INITIAL MOCK DATA (Synced with Solidity)
// ==========================================

const ROLES = {
  NONE: 'NONE',
  FARMER: 'FARMER',
  DISTRIBUTOR: 'DISTRIBUTOR',
  RETAILER: 'RETAILER',
  ADMIN: 'ADMIN'
};

const STATUS_MAP = {
  HARVESTED: { label: 'เก็บเกี่ยวแล้ว', color: 'badge-harvested' },
  IN_TRANSIT: { label: 'อยู่ระหว่างขนส่ง', color: 'badge-transit' },
  IN_WAREHOUSE: { label: 'ถึงคลังสินค้า/ศูนย์คัดแยก', color: 'badge-warehouse' },
  DELIVERED: { label: 'ส่งถึงร้านค้าแล้ว', color: 'badge-delivered' },
  RECALLED: { label: 'เรียกคืนสินค้า (Recalled)', color: 'badge-recalled' }
};

const INITIAL_STAKEHOLDERS = [
  { address: '0x8b2A...9F41', name: 'คุณสมชาย (ฟาร์มสุขใจ เชียงใหม่)', role: ROLES.FARMER, location: 'เชียงใหม่' },
  { address: '0x3cD1...7A28', name: 'คุณวิภา (แม่ฮ่องสอน สมาร์ทฟาร์ม)', role: ROLES.FARMER, location: 'แม่ฮ่องสอน' },
  { address: '0x5eF9...210C', name: 'บริษัท กรีนเอ็กซ์เพรส โลจิสติกส์ จำกัด', role: ROLES.DISTRIBUTOR, location: 'ศูนย์กระจายสินค้า บางบัวทอง' },
  { address: '0x1a4B...8E90', name: 'กรีนมาร์เก็ต ซูเปอร์มาร์เก็ต (สาขาชิดลม)', role: ROLES.RETAILER, location: 'กรุงเทพมหานคร' },
  { address: '0x99F0...001A', name: 'ผู้ดูแลระบบ GreenFarm Admin', role: ROLES.ADMIN, location: 'สำนักงานใหญ่' }
];

const INITIAL_BATCHES = [
  {
    batchId: 'BATCH-2026-001',
    productName: 'เมล่อนญี่ปุ่นพันธุ์คิโมจิ (Kimoji Melon)',
    harvestDate: '2026-11-02',
    originLocation: 'ฟาร์มสุขใจ อ.แม่ริม จ.เชียงใหม่',
    certificationInfo: 'GAP-TH-9001-8842 (มาตรฐานเกษตรปลอดภัยระดับพรีเมียม)',
    currentOwner: '0x1a4B...8E90',
    ownerName: 'กรีนมาร์เก็ต ซูเปอร์มาร์เก็ต (สาขาชิดลม)',
    status: 'DELIVERED',
    isRecalled: false,
    recallReason: '',
    history: [
      {
        holder: '0x8b2A...9F41',
        holderName: 'คุณสมชาย (ฟาร์มสุขใจ)',
        timestamp: '2026-11-02 07:30 น.',
        location: 'ฟาร์มสุขใจ อ.แม่ริม จ.เชียงใหม่',
        remarks: 'เก็บเกี่ยวผลผลิต ตรวจวัดความหวานได้ 15 Brix ตามมาตรฐาน',
        txHash: '0x71fa...88b2'
      },
      {
        holder: '0x5eF9...210C',
        holderName: 'กรีนเอ็กซ์เพรส โลจิสติกส์',
        timestamp: '2026-11-03 10:15 น.',
        location: 'ศูนย์คัดแยกและบรรจุภัณฑ์ บางบัวทอง จ.นนทบุรี',
        remarks: 'รับเข้าคลังสินค้า อุณหภูมิควบคุม 4°C เรียบร้อยดี',
        txHash: '0x9c3e...112e'
      },
      {
        holder: '0x1a4B...8E90',
        holderName: 'กรีนมาร์เก็ต ซูเปอร์มาร์เก็ต',
        timestamp: '2026-11-04 14:00 น.',
        location: 'กรีนมาร์เก็ต สาขาชิดลม กรุงเทพฯ',
        remarks: 'จัดขึ้นชั้นวางจำหน่าย โซนผักผลไม้ปลอดภัย',
        txHash: '0x4b81...fa09'
      }
    ]
  },
  {
    batchId: 'BATCH-2026-002',
    productName: 'ผักกรีนโอ๊คออร์แกนิค (Organic Green Oak)',
    harvestDate: '2026-11-05',
    originLocation: 'แม่ฮ่องสอน สมาร์ทฟาร์ม อ.เมือง จ.แม่ฮ่องสอน',
    certificationInfo: 'ORGANIC-TH-2026-4410',
    currentOwner: '0x5eF9...210C',
    ownerName: 'กรีนเอ็กซ์เพรส โลจิสติกส์',
    status: 'IN_TRANSIT',
    isRecalled: false,
    recallReason: '',
    history: [
      {
        holder: '0x3cD1...7A28',
        holderName: 'คุณวิภา (แม่ฮ่องสอน สมาร์ทฟาร์ม)',
        timestamp: '2026-11-05 06:00 น.',
        location: 'แปลงปลูกออร์แกนิค อ.เมือง จ.แม่ฮ่องสอน',
        remarks: 'เก็บเกี่ยวเช้าตรู่ สดใหม่ บรรจุลงกล่องควบคุมความเย็น',
        txHash: '0x88ad...331b'
      },
      {
        holder: '0x5eF9...210C',
        holderName: 'กรีนเอ็กซ์เพรส โลจิสติกส์',
        timestamp: '2026-11-06 09:30 น.',
        location: 'ระหว่างการขนส่ง รถควบคุมอุณหภูมิทะเบียน 70-4921',
        remarks: 'รับมอบสินค้าและอยู่ระหว่างเดินทางมุ่งหน้ากรุงเทพฯ',
        txHash: '0x32cc...ee77'
      }
    ]
  }
];

export default function GreenFarmApp() {
  const [activeTab, setActiveTab] = useState('consumer');
  const [stakeholders, setStakeholders] = useState(INITIAL_STAKEHOLDERS);
  const [batches, setBatches] = useState(INITIAL_BATCHES);

  const [currentWallet, setCurrentWallet] = useState({
    address: '0x99F0...001A',
    role: ROLES.CONSUMER,
    name: 'ผู้เยี่ยมชม / ผู้บริโภค (Public)'
  });

  const [searchBatchId, setSearchBatchId] = useState('BATCH-2026-001');
  const [selectedBatch, setSelectedBatch] = useState(INITIAL_BATCHES[0]);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSearchBatch = (idToSearch) => {
    const id = idToSearch || searchBatchId;
    const found = batches.find(b => b.batchId.toLowerCase() === id.trim().toLowerCase());
    if (found) {
      setSelectedBatch(found);
    } else {
      showToast('ไม่พบข้อมูลล็อตสินค้า', `ไม่พบล็อตรหัส "${id}" ในระบบบล็อกเชน`, 'error');
    }
  };

  const handleRoleSwitch = (roleKey) => {
    switch (roleKey) {
      case 'CONSUMER':
        setCurrentWallet({ address: 'Public Viewer', role: ROLES.CONSUMER, name: 'ผู้บริโภคทั่วไป' });
        setActiveTab('consumer');
        break;
      case 'FARMER':
        setCurrentWallet({ address: '0x8b2A...9F41', role: ROLES.FARMER, name: 'คุณสมชาย (เกษตรกร)' });
        setActiveTab('farmer');
        break;
      case 'DISTRIBUTOR':
        setCurrentWallet({ address: '0x5eF9...210C', role: ROLES.DISTRIBUTOR, name: 'กรีนเอ็กซ์เพรส (ผู้ขนส่ง)' });
        setActiveTab('logistics');
        break;
      case 'ADMIN':
        setCurrentWallet({ address: '0x99F0...001A', role: ROLES.ADMIN, name: 'GreenFarm Admin' });
        setActiveTab('admin');
        break;
      default:
        break;
    }
    showToast('เปลี่ยนสิทธิ์ผู้ใช้งานสำเร็จ', `ขณะนี้ใช้งานในสิทธิ์: ${roleKey}`, 'info');
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-top max-w-wrap">
          <div className="brand-logo" onClick={() => setActiveTab('consumer')}>
            <div className="logo-box">
              <Sprout size={24} />
            </div>
            <div>
              <div className="brand-title">
                <span>GreenFarm Traceability</span>
                <span className="pill-tag">Blockchain Verified</span>
              </div>
              <p className="sub-text">ระบบตรวจสอบย้อนกลับสินค้าเกษตรปลอดภัย</p>
            </div>
          </div>

          <div className="nav-actions">
            <div className="role-btn-group">
              <span className="role-label">สิทธิ์ปัจจุบัน:</span>
              <button className={`role-btn ${currentWallet.role === ROLES.CONSUMER ? 'active' : ''}`} onClick={() => handleRoleSwitch('CONSUMER')}>ผู้บริโภค</button>
              <button className={`role-btn ${currentWallet.role === ROLES.FARMER ? 'active' : ''}`} onClick={() => handleRoleSwitch('FARMER')}>เกษตรกร</button>
              <button className={`role-btn ${currentWallet.role === ROLES.DISTRIBUTOR ? 'active' : ''}`} onClick={() => handleRoleSwitch('DISTRIBUTOR')}>ขนส่ง/คลัง</button>
              <button className={`role-btn ${currentWallet.role === ROLES.ADMIN ? 'active' : ''}`} onClick={() => handleRoleSwitch('ADMIN')}>ผู้ดูแลระบบ</button>
            </div>

            <button className="qr-scan-btn" onClick={() => setIsQrModalOpen(true)}>
              <QrCode size={16} />
              <span>สแกน QR Code</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="nav-tabs-bar">
          <div className="max-w-wrap tabs-flex">
            <button className={`tab-item ${activeTab === 'consumer' ? 'active' : ''}`} onClick={() => setActiveTab('consumer')}>
              <Search size={16} /> <span>1. ตรวจสอบย้อนกลับ (สำหรับผู้บริโภค)</span>
            </button>
            <button className={`tab-item ${activeTab === 'farmer' ? 'active' : ''}`} onClick={() => setActiveTab('farmer')}>
              <Sprout size={16} /> <span>2. ลงทะเบียนสินค้า (เกษตรกร)</span>
            </button>
            <button className={`tab-item ${activeTab === 'logistics' ? 'active' : ''}`} onClick={() => setActiveTab('logistics')}>
              <Truck size={16} /> <span>3. ขนส่ง & เปลี่ยนผู้ครอบครอง</span>
            </button>
            <button className={`tab-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
              <ShieldCheck size={16} /> <span>4. ผู้ดูแลระบบ & การเรียกคืนสินค้า</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content max-w-wrap">
        {/* TAB 1: CONSUMER TRACEABILITY */}
        {activeTab === 'consumer' && (
          <div className="tab-pane">
            <div className="hero-search-card">
              <span className="subtitle-pill"><ShieldCheck size={14} /> โปร่งใส ตรวจสอบย้อนกลับได้ 100% บนบล็อกเชน</span>
              <h2>ตรวจสอบแหล่งที่มาและประวัติสินค้าเกษตร</h2>
              <p>ป้อนรหัสล็อตสินค้า (Batch ID) หรือสแกน QR Code บนบรรจุภัณฑ์ เพื่อดูประวัติการเก็บเกี่ยว เส้นทางการขนส่ง และใบรับรองความปลอดภัย GAP</p>
              
              <div className="search-form-row">
                <div className="input-with-icon">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    value={searchBatchId}
                    onChange={(e) => setSearchBatchId(e.target.value)}
                    placeholder="กรอกรหัสล็อตสินค้า เช่น BATCH-2026-001"
                  />
                </div>
                <button className="btn-sand" onClick={() => handleSearchBatch()}>ค้นหาข้อมูล</button>
              </div>

              <div className="preset-row">
                <span>ตัวอย่างล็อตทดสอบ:</span>
                {batches.map((b) => (
                  <button
                    key={b.batchId}
                    className={`chip-btn ${selectedBatch?.batchId === b.batchId ? 'active' : ''}`}
                    onClick={() => { setSearchBatchId(b.batchId); handleSearchBatch(b.batchId); }}
                  >
                    {b.batchId} {b.isRecalled ? '⚠️' : ''}
                  </button>
                ))}
              </div>
            </div>

            {selectedBatch && (
              <div className="trace-result-wrapper">
                {selectedBatch.isRecalled && (
                  <div className="recall-alert-box">
                    <AlertTriangle size={32} className="alert-icon" />
                    <div>
                      <h3>⚠️ คำเตือน: สินค้าล็อตนี้ถูกระงับและเรียกคืน (PRODUCT RECALLED)</h3>
                      <p><strong>สาเหตุการเรียกคืน:</strong> {selectedBatch.recallReason}</p>
                      <small>ข้อแนะนำ: โปรดงดบริโภคและนำสินค้ามาคืน ณ จุดจำหน่ายเพื่อขอรับเงินคืน</small>
                    </div>
                  </div>
                )}

                <div className="card-box batch-summary-card">
                  <div className="card-header-flex">
                    <div>
                      <div className="batch-head-tags">
                        <span className="batch-id-tag">{selectedBatch.batchId}</span>
                        <span className={`status-badge ${STATUS_MAP[selectedBatch.status]?.color}`}>
                          ● {STATUS_MAP[selectedBatch.status]?.label}
                        </span>
                      </div>
                      <h2 className="product-title">{selectedBatch.productName}</h2>
                      <p className="location-text"><MapPin size={14} /> แหล่งผลิต: {selectedBatch.originLocation}</p>
                    </div>

                    <div className="cert-badge-box">
                      <Award size={32} />
                      <div>
                        <p className="cert-label">มาตรฐานการรับรองคุณภาพ</p>
                        <p className="cert-val">{selectedBatch.certificationInfo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="info-grid-3">
                    <div className="grid-item">
                      <span className="lbl">วันที่เก็บเกี่ยว</span>
                      <span className="val">{selectedBatch.harvestDate}</span>
                    </div>
                    <div className="grid-item">
                      <span className="lbl">ผู้ครอบครองปัจจุบัน</span>
                      <span className="val">{selectedBatch.ownerName}</span>
                    </div>
                    <div className="grid-item">
                      <span className="lbl">ความน่าเชื่อถือบล็อกเชน</span>
                      <span className="val success"><ShieldCheck size={14} /> Verified (Immutable)</span>
                    </div>
                  </div>
                </div>

                <div className="card-box timeline-card">
                  <h3><Activity size={18} /> เส้นทางการเดินทางของสินค้า (Supply Chain Journey)</h3>
                  <div className="timeline-container">
                    {selectedBatch.history.map((rec, idx) => (
                      <div key={idx} className="timeline-step">
                        <div className="circle-num">{idx + 1}</div>
                        <div className="step-content">
                          <div className="step-header">
                            <h4>{rec.holderName}</h4>
                            <span className="time-text"><Clock size={12} /> {rec.timestamp}</span>
                          </div>
                          <p className="loc-info"><MapPin size={12} /> {rec.location}</p>
                          <p className="remarks-info"><FileText size={12} /> {rec.remarks}</p>
                          <div className="tx-footer">
                            <span><User size={12} /> {rec.holder}</span>
                            <code className="tx-hash">TX: {rec.txHash}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FARMER PORTAL */}
        {activeTab === 'farmer' && (
          <div className="tab-pane">
            <div className="pane-header-banner">
              <h2>ลงทะเบียนและสร้างล็อตสินค้าใหม่ (registerBatch)</h2>
              <p>กรอกข้อมูลสินค้าทางการเกษตรเพื่อลงบันทึกข้อมูลเข้าสู่ Smart Contract บนระบบบล็อกเชน</p>
            </div>

            <div className="card-box form-card">
              <h3><PlusCircle size={18} /> บันทึกข้อมูลผลผลิตล็อตใหม่</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const batchId = form.batchId.value;
                const productName = form.productName.value;

                if (batches.some(b => b.batchId.toLowerCase() === batchId.toLowerCase())) {
                  showToast('รหัสล็อตซ้ำ', 'รหัสล็อตนี้มีอยู่ในระบบแล้ว', 'error');
                  return;
                }

                const newObj = {
                  batchId,
                  productName,
                  harvestDate: form.harvestDate.value || new Date().toISOString().split('T')[0],
                  originLocation: form.originLocation.value || 'ฟาร์มเกษตรปลอดภัย',
                  certificationInfo: form.certificationInfo.value || 'GAP-STANDARD',
                  currentOwner: currentWallet.address,
                  ownerName: currentWallet.name,
                  status: 'HARVESTED',
                  isRecalled: false,
                  recallReason: '',
                  history: [{
                    holder: currentWallet.address,
                    holderName: currentWallet.name,
                    timestamp: new Date().toLocaleString('th-TH'),
                    location: form.originLocation.value || 'ฟาร์มเกษตรปลอดภัย',
                    remarks: 'ลงทะเบียนเก็บเกี่ยวผลผลิตเริ่มต้น',
                    txHash: '0x' + Math.random().toString(16).substring(2, 10)
                  }]
                };

                setBatches([newObj, ...batches]);
                setSelectedBatch(newObj);
                showToast('สำเร็จ', `ลงทะเบียนล็อตสินค้า ${batchId} เรียบร้อยแล้ว`);
                form.reset();
              }}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>รหัสล็อตสินค้า (Batch ID) *</label>
                    <input name="batchId" required placeholder="เช่น BATCH-2026-003" />
                  </div>
                  <div className="form-group">
                    <label>ชื่อสินค้า / พันธุ์พืช *</label>
                    <input name="productName" required placeholder="เช่น เมล่อนญี่ปุ่น" />
                  </div>
                  <div className="form-group">
                    <label>วันที่เก็บเกี่ยว</label>
                    <input type="date" name="harvestDate" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>มาตรฐานรับรอง (Certifications)</label>
                    <input name="certificationInfo" placeholder="เช่น GAP-TH-9001" />
                  </div>
                </div>
                <div className="form-group">
                  <label>สถานที่ผลิต / ฟาร์ม</label>
                  <input name="originLocation" placeholder="เช่น ฟาร์มสุขใจ อ.แม่ริม จ.เชียงใหม่" />
                </div>
                <button type="submit" className="btn-dark-green"><Sprout size={16} /> ยื่นบันทึกข้อมูลลง Blockchain</button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: LOGISTICS & TRANSFER */}
        {activeTab === 'logistics' && (
          <div className="tab-pane">
            <div className="pane-header-banner">
              <h2>ส่งมอบสินค้าและเปลี่ยนผู้ครอบครอง (transferCustody)</h2>
              <p>บันทึกการส่งมอบสินค้า อัปเดตสถานที่ และเปลี่ยนสถานะในห่วงโซ่อุปทาน</p>
            </div>

            <div className="card-box form-card">
              <h3><Truck size={18} /> บันทึกการส่งมอบสินค้า</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const batchId = form.batchId.value;
                const newOwnerAddr = form.newOwner.value;

                const idx = batches.findIndex(b => b.batchId === batchId);
                if (idx === -1) return;

                const targetBatch = batches[idx];
                if (targetBatch.isRecalled) {
                  showToast('ระงับการโอนย้าย', 'ล็อตนี้ถูกระงับการขนส่งเนื่องจากถูกเรียกคืนสินค้า', 'error');
                  return;
                }

                const stakeholderObj = stakeholders.find(s => s.address === newOwnerAddr);
                const newOwnerName = stakeholderObj ? stakeholderObj.name : newOwnerAddr;

                const updated = {
                  ...targetBatch,
                  currentOwner: newOwnerAddr,
                  ownerName: newOwnerName,
                  status: form.status.value,
                  history: [
                    ...targetBatch.history,
                    {
                      holder: newOwnerAddr,
                      holderName: newOwnerName,
                      timestamp: new Date().toLocaleString('th-TH'),
                      location: form.location.value,
                      remarks: form.remarks.value || 'ส่งมอบเรียบร้อย',
                      txHash: '0x' + Math.random().toString(16).substring(2, 10)
                    }
                  ]
                };

                const arr = [...batches];
                arr[idx] = updated;
                setBatches(arr);
                showToast('สำเร็จ', `อัปเดตผู้ครอบครองใหม่เป็น ${newOwnerName}`);
              }}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>เลือกล็อตสินค้า *</label>
                    <select name="batchId" required>
                      <option value="">-- เลือกล็อต --</option>
                      {batches.map(b => <option key={b.batchId} value={b.batchId}>{b.batchId} - {b.productName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ผู้รับมอบใหม่ *</label>
                    <select name="newOwner" required>
                      <option value="">-- เลือก Stakeholder --</option>
                      {stakeholders.map(s => <option key={s.address} value={s.address}>{s.name} ({s.role})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>สถานที่ปัจจุบัน *</label>
                    <input name="location" required placeholder="เช่น คลังสินค้ากระจายสินค้า บางบัวทอง" />
                  </div>
                  <div className="form-group">
                    <label>อัปเดตสถานะ *</label>
                    <select name="status" required>
                      <option value="IN_TRANSIT">อยู่ระหว่างขนส่ง (IN_TRANSIT)</option>
                      <option value="IN_WAREHOUSE">ถึงคลังสินค้า (IN_WAREHOUSE)</option>
                      <option value="DELIVERED">ส่งถึงร้านค้าแล้ว (DELIVERED)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>หมายเหตุการตรวจรับ</label>
                  <input name="remarks" placeholder="เช่น ตรวจสอบอุณหภูมิ 4°C เรียบร้อย" />
                </div>
                <button type="submit" className="btn-dark-green"><Send size={16} /> บันทึกการส่งมอบสินค้า</button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN & RECALL */}
        {activeTab === 'admin' && (
          <div className="tab-pane">
            <div className="pane-header-banner danger-banner">
              <h2>ระบบผู้ดูแลระบบและการจัดการเรียกคืนสินค้า (Recall)</h2>
              <p>อนุมัติสิทธิ์ผู้ใช้งาน และประกาศแจ้งเตือนเรียกคืนสินค้าที่มีปัญหาฉุกเฉิน</p>
            </div>

            <div className="grid-2col">
              <div className="card-box form-card recall-card border-red">
                <h3 className="danger-title"><AlertTriangle size={18} /> แจ้งเตือนเรียกคืนสินค้า (Product Recall)</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const batchId = form.recallBatchId.value;
                  const reason = form.reason.value;

                  const idx = batches.findIndex(b => b.batchId === batchId);
                  if (idx === -1) return;

                  const updated = {
                    ...batches[idx],
                    isRecalled: true,
                    recallReason: reason,
                    status: 'RECALLED',
                    history: [
                      ...batches[idx].history,
                      {
                        holder: currentWallet.address,
                        holderName: 'GreenFarm Admin (Recall)',
                        timestamp: new Date().toLocaleString('th-TH'),
                        location: 'ฝ่าย QA ศูนย์ใหญ่',
                        remarks: `⚠️ ประกาศเรียกคืน: ${reason}`,
                        txHash: '0x' + Math.random().toString(16).substring(2, 10)
                      }
                    ]
                  };

                  const arr = [...batches];
                  arr[idx] = updated;
                  setBatches(arr);
                  setSelectedBatch(updated);
                  showToast('ระงับสินค้าเรียบร้อย', `ประกาศ Recall ล็อต ${batchId} สำเร็จ`, 'error');
                }}>
                  <div className="form-group">
                    <label>เลือกล็อตสินค้าที่มีปัญหา *</label>
                    <select name="recallBatchId" required>
                      <option value="">-- เลือกล็อตสินค้า --</option>
                      {batches.filter(b => !b.isRecalled).map(b => (
                        <option key={b.batchId} value={b.batchId}>{b.batchId} - {b.productName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>เหตุผลในการเรียกคืน *</label>
                    <textarea name="reason" required rows="3" placeholder="ระบุเหตุผล เช่น สุ่มตรวจพบเชื้อแบคทีเรียเกินเกณฑ์มาตรฐาน"></textarea>
                  </div>
                  <button type="submit" className="btn-danger"><AlertTriangle size={16} /> ยืนยันประกาศระงับและเรียกคืนสินค้า</button>
                </form>
              </div>

              <div className="card-box form-card">
                <h3><UserCheck size={18} /> อนุมัติสิทธิ์ผู้ใช้งาน (registerStakeholder)</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const newStk = {
                    address: form.address.value,
                    name: form.name.value,
                    role: form.role.value,
                    location: form.location.value || 'ประเทศไทย'
                  };
                  setStakeholders([...stakeholders, newStk]);
                  showToast('อนุมัติสิทธิ์สำเร็จ', `อนุมัติ ${newStk.name} เป็น ${newStk.role}`);
                  form.reset();
                }}>
                  <div className="form-group">
                    <label>Wallet Address *</label>
                    <input name="address" required placeholder="0x..." />
                  </div>
                  <div className="form-group">
                    <label>ชื่อองค์กร / เกษตรกร *</label>
                    <input name="name" required placeholder="เช่น ฟาร์มผักออร์แกนิค" />
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>บทบาท (Role) *</label>
                      <select name="role" required>
                        <option value={ROLES.FARMER}>FARMER (เกษตรกร)</option>
                        <option value={ROLES.DISTRIBUTOR}>DISTRIBUTOR (ขนส่ง)</option>
                        <option value={ROLES.RETAILER}>RETAILER (ร้านค้า)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>จังหวัด</label>
                      <input name="location" placeholder="เช่น เชียงใหม่" />
                    </div>
                  </div>
                  <button type="submit" className="btn-dark-green"><UserCheck size={16} /> บันทึกสิทธิ์ลงบล็อกเชน</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3><QrCode size={20} /> จำลองการสแกน QR Code</h3>
              <button onClick={() => setIsQrModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <p className="modal-sub">เลือกล็อตสินค้าเพื่อทดสอบดึงข้อมูลย้อนกลับจาก Smart Contract:</p>
            <div className="qr-preview-box">
              <QrCode size={64} className="qr-icon-large" />
              <span>นำกล้องสแกน QR Code บนกล่องบรรจุภัณฑ์</span>
            </div>
            <div className="qr-choices">
              {batches.map(b => (
                <button
                  key={b.batchId}
                  className="qr-choice-btn"
                  onClick={() => {
                    setSearchBatchId(b.batchId);
                    handleSearchBatch(b.batchId);
                    setIsQrModalOpen(false);
                    setActiveTab('consumer');
                  }}
                >
                  <strong>{b.batchId}</strong> - <span>{b.productName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}