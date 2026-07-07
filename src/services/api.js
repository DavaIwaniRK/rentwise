// Titik pusat untuk semua komunikasi ke backend.
// Saat ini pakai data dummy + delay palsu supaya terasa seperti network call.
// Kalau backend sudah siap, ganti isi tiap fungsi dengan fetch() ke API asli.

const BASE_URL = "https://api.rentwise.example.com";

const DUMMY_KOST = [
  {
    id: "1",
    nama: "Kost Melati",
    area: "Jakarta Pusat",
    daerah: "Menteng",
    hargaSekarang: 1200000,
    hargaEstimasi: 1300000,
    jarakKampus: 60,
    jarakStasiun: 30,
    gambar: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
    deskripsi: "Kamar kost nyaman, lokasi strategis dekat kampus dan stasiun, fasilitas lengkap.",
    tanggalUpdate: "2026-07-08",
  },
  {
    id: "2",
    nama: "Kost Melati 2",
    area: "Jakarta Pusat",
    daerah: "Gambir",
    hargaSekarang: 1500000,
    hargaEstimasi: 1400000,
    jarakKampus: 250,
    jarakStasiun: 75,
    gambar: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    deskripsi: "Kost asri dengan suasana tenang, cocok untuk mahasiswa maupun pekerja.",
    tanggalUpdate: "2026-07-02",
  },
  {
    id: "3",
    nama: "Kost Pak Prac",
    area: "Jakarta Barat",
    daerah: "Kebon Jeruk",
    hargaSekarang: 6500000,
    hargaEstimasi: 7000000,
    jarakKampus: 250,
    jarakStasiun: 1000,
    gambar: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    deskripsi: "Rumah kontrakan luas dan strategis, cocok untuk keluarga kecil.",
    tanggalUpdate: "2026-07-08",
  },
  {
    id: "4",
    nama: "Kost Anggrek",
    area: "Jakarta Selatan",
    daerah: "Kebayoran Baru",
    hargaSekarang: 1800000,
    hargaEstimasi: 1900000,
    jarakKampus: 400,
    jarakStasiun: 150,
    gambar: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    deskripsi: "Kost bersih dan nyaman di kawasan Kebayoran Baru, dekat pusat perbelanjaan.",
    tanggalUpdate: "2026-07-05",
  },
  {
    id: "5",
    nama: "Kost Mawar",
    area: "Jakarta Selatan",
    daerah: "Tebet",
    hargaSekarang: 1100000,
    hargaEstimasi: 1200000,
    jarakKampus: 500,
    jarakStasiun: 200,
    gambar: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    deskripsi: "Kost strategis di Tebet, dekat MRT dan berbagai kuliner.",
    tanggalUpdate: "2026-07-01",
  },
  {
    id: "6",
    nama: "Kost Cempaka",
    area: "Jakarta Utara",
    daerah: "Kelapa Gading",
    hargaSekarang: 1400000,
    hargaEstimasi: 1500000,
    jarakKampus: 700,
    jarakStasiun: 300,
    gambar: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    deskripsi: "Kost modern di Kelapa Gading, area komersial dengan berbagai fasilitas lengkap.",
    tanggalUpdate: "2026-07-06",
  },
  {
    id: "7",
    nama: "Kost Kenanga",
    area: "Jakarta Timur",
    daerah: "Cakung",
    hargaSekarang: 900000,
    hargaEstimasi: 1000000,
    jarakKampus: 800,
    jarakStasiun: 500,
    gambar: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
    deskripsi: "Kost terjangkau di Jakarta Timur, lingkungan tenang untuk mahasiswa.",
    tanggalUpdate: "2026-07-03",
  },
  {
    id: "8",
    nama: "Kost Dahlia",
    area: "Bogor",
    daerah: "Bogor Tengah",
    hargaSekarang: 700000,
    hargaEstimasi: 750000,
    jarakKampus: 300,
    jarakStasiun: 400,
    gambar: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800",
    deskripsi: "Kost murah di pusat kota Bogor, udara segar dan suasana tenang.",
    tanggalUpdate: "2026-07-07",
  },
  {
    id: "9",
    nama: "Kost Sejahtera",
    area: "Bekasi",
    daerah: "Bekasi Barat",
    hargaSekarang: 850000,
    hargaEstimasi: 900000,
    jarakKampus: 1200,
    jarakStasiun: 600,
    gambar: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    deskripsi: "Kost nyaman di Bekasi Barat, akses mudah ke tol dan transportasi menuju Jakarta.",
    tanggalUpdate: "2026-07-04",
  },
  {
    id: "10",
    nama: "Kost Menteng Indah",
    area: "Jakarta Pusat",
    daerah: "Menteng",
    hargaSekarang: 2500000,
    hargaEstimasi: 2600000,
    jarakKampus: 100,
    jarakStasiun: 50,
    gambar: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    deskripsi: "Kost premium di Menteng, kawasan elite Jakarta Pusat. Fasilitas lengkap dan keamanan 24 jam.",
    tanggalUpdate: "2026-07-08",
  },
];

// Peta kota beserta daerah-daerahnya — dipakai di halaman Search
export const WILAYAH = [
  {
    kota: "Jakarta Pusat",
    daerah: ["Menteng", "Gambir", "Tanah Abang", "Senen", "Cempaka Putih", "Johar Baru"],
  },
  {
    kota: "Jakarta Selatan",
    daerah: ["Kebayoran Baru", "Tebet", "Setiabudi", "Mampang Prapatan", "Pancoran", "Cilandak"],
  },
  {
    kota: "Jakarta Barat",
    daerah: ["Kebon Jeruk", "Grogol Petamburan", "Kembangan", "Cengkareng", "Tambora", "Palmerah"],
  },
  {
    kota: "Jakarta Utara",
    daerah: ["Kelapa Gading", "Penjaringan", "Pademangan", "Tanjung Priok", "Koja", "Cilincing"],
  },
  {
    kota: "Jakarta Timur",
    daerah: ["Cakung", "Jatinegara", "Kramat Jati", "Matraman", "Pulo Gadung", "Duren Sawit"],
  },
  {
    kota: "Bogor",
    daerah: ["Bogor Tengah", "Bogor Utara", "Bogor Selatan", "Bogor Timur", "Bogor Barat", "Tanah Sareal"],
  },
  {
    kota: "Bekasi",
    daerah: ["Bekasi Barat", "Bekasi Timur", "Bekasi Utara", "Bekasi Selatan", "Jatiasih", "Rawalumbu"],
  },
  {
    kota: "Depok",
    daerah: ["Beji", "Cimanggis", "Sukmajaya", "Pancoran Mas", "Cipayung", "Sawangan"],
  },
  {
    kota: "Tangerang",
    daerah: ["Cipondoh", "Pinang", "Tangerang Kota", "Ciledug", "Karawaci", "Neglasari"],
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- AUTH ---

export async function loginUser(email, password) {
  await delay(700);
  if (!email || !password) throw new Error("Email dan password wajib diisi");
  return { token: "dummy-token-123", user: { id: "u1", nama: "Wowo", email } };
}

export async function registerUser(username, email, password) {
  await delay(700);
  return { token: "dummy-token-123", user: { id: "u1", nama: username, email } };
}

// --- KOST ---

export async function getKostList() {
  await delay(400);
  return DUMMY_KOST;
}

// Pencarian kost berdasarkan keyword, area (kota), dan daerah
export async function searchKost({ keyword = "", area = "", daerah = "" } = {}) {
  await delay(300);
  const q = keyword.toLowerCase().trim();
  return DUMMY_KOST.filter((k) => {
    const matchArea    = area    ? k.area.toLowerCase()   === area.toLowerCase()   : true;
    const matchDaerah  = daerah  ? k.daerah.toLowerCase() === daerah.toLowerCase() : true;
    const matchKeyword = q
      ? k.nama.toLowerCase().includes(q)   ||
        k.area.toLowerCase().includes(q)   ||
        k.daerah.toLowerCase().includes(q)
      : true;
    return matchArea && matchDaerah && matchKeyword;
  });
}

export async function getKostById(id) {
  await delay(400);
  const found = DUMMY_KOST.find((k) => k.id === id);
  if (!found) throw new Error("Kost tidak ditemukan");
  return found;
}

// --- PROFILE ---

export async function getProfile() {
  await delay(400);
  return { nama: "", bio: "", email: "testing@gmail.com", password: "********" };
}

export async function updateProfile(data) {
  await delay(500);
  return { ...data, updated: true };
}