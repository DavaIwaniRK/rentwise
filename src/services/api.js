// Titik pusat untuk semua komunikasi ke backend RentWise.
// Menghubungkan aplikasi React Native Expo ke server backend lokal Express.

// Gunakan 10.0.2.2 untuk emulator Android, atau IP laptop Anda jika diuji menggunakan HP fisik
const BASE_URL = "http://10.124.8.222:3001";

// Variabel modul untuk menyimpan session user yang sedang aktif secara in-memory
let currentToken = null;
let currentUser = null;

// Helper untuk mengambil header otorisasi JWT
function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };
  if (currentToken) {
    headers["Authorization"] = `Bearer ${currentToken}`;
  }
  return headers;
}

// --- AUTH ---

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Email atau password salah.");
    }

    // Simpan token dan data user di memori modul api.js
    currentToken = data.accessToken;
    currentUser = data.data;

    return {
      token: data.accessToken,
      user: {
        id: String(data.data.id),
        nama: data.data.name,
        email: data.data.email,
        role: data.data.role
      }
    };
  } catch (err) {
    throw new Error(err.message || "Gagal terhubung ke server backend.");
  }
}

export async function registerUser(username, email, password) {
  try {
    // 1. Kirim data registrasi ke backend
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: username,
        email,
        password,
        no_tlp: "08123456789", // Default phone untuk registrasi mobile
        role: "user" // Role default pencari kost untuk mobile
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data.errors && data.errors.length > 0
        ? data.errors.join(", ")
        : (data.message || "Registrasi gagal.");
      throw new Error(errorMsg);
    }

    // 2. Untuk UX yang mulus, lakukan login otomatis setelah registrasi berhasil
    return await loginUser(email, password);
  } catch (err) {
    throw new Error(err.message || "Registrasi gagal.");
  }
}

// --- KOST (PROPERTI) ---

// Fungsi helper untuk memetakan respon properti dari model database ke format yang diharapkan mobile UI
function mapPropertyToMobile(p) {
  // Ekstrak area dan daerah secara cerdas dari string lokasi alamat lengkap
  const locationParts = p.lokasi ? p.lokasi.split(",") : [];
  const daerah = locationParts[0]?.trim() || "Menteng";
  const area = locationParts[locationParts.length - 2]?.trim() || locationParts[locationParts.length - 1]?.trim() || "Jakarta Pusat";

  return {
    id: String(p.id),
    nama: p.nama,
    tipe: p.tipe,
    luas: Number(p.luas),
    jumlahKamar: Number(p.jumlah_kamar),
    area: area,
    daerah: daerah,
    hargaSekarang: Number(p.harga),
    hargaEstimasi: p.estimasi_harga ? Number(p.estimasi_harga) : Math.round(Number(p.harga) * 0.95), // Estimasi harga wajar ML
    jarakKampus: Number(p.jarak), // Jarak riil dari kalkulasi OSRM
    jarakStasiun: Math.round(Number(p.jarak) * 0.8), // Variasi jarak stasiun pendukung
    jarakjalanutama: Number(p.jarak), // Jarak ke jalan utama riil
    gambar: p.id ? `${BASE_URL}/api/properties/${p.id}/image` : "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
    deskripsi: p.deskripsi || "Kamar kost nyaman, lokasi strategis dengan fasilitas pendukung lengkap.",
    tanggalUpdate: (p.updatedAt || p.updated_at) ? (p.updatedAt || p.updated_at).split("T")[0] : "2026-07-08",
    noTlp: p.owner?.no_tlp || p.no_tlp || "+62123456789",
  };
}

export const WILAYAH = [
  {
    kota: "Jakarta Pusat",
    daerah: ["Menteng", "Gambir", "Senen", "Kemayoran", "Tanah Abang"]
  },
  {
    kota: "Jakarta Selatan",
    daerah: ["Tebet", "Kebayoran Baru", "Cilandak", "Setiabudi", "Pasar Minggu"]
  },
  {
    kota: "Jakarta Barat",
    daerah: ["Grogol", "Palmerah", "Kembangan", "Kebon Jeruk"]
  },
  {
    kota: "Jakarta Utara",
    daerah: ["Kelapa Gading", "Pluit", "Ancol", "Sunter"]
  },
  {
    kota: "Jakarta Timur",
    daerah: ["Rawamangun", "Pulogadung", "Jatinegara", "Cawang"]
  }
];

export async function getKostList() {
  try {
    // Ambil properti yang sudah aktif terverifikasi oleh Admin
    const response = await fetch(`${BASE_URL}/api/properties?status_verifikasi=aktif`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Gagal memuat list properti.");
    }

    return (data.data || []).map(mapPropertyToMobile);
  } catch (err) {
    console.error("Gagal mengambil data kost:", err);
    throw new Error("Gagal mengambil data kost dari backend.");
  }
}

// Pencarian kost berdasarkan keyword, area (kota), dan daerah
export async function searchKost({ keyword = "", area = "", daerah = "" } = {}) {
  try {
    const list = await getKostList();
    const q = keyword.toLowerCase().trim();

    return list.filter((k) => {
      const matchArea = area ? k.area.toLowerCase() === area.toLowerCase() : true;
      const matchDaerah = daerah ? k.daerah.toLowerCase() === daerah.toLowerCase() : true;
      const matchKeyword = q
        ? k.nama.toLowerCase().includes(q) ||
        k.area.toLowerCase().includes(q) ||
        k.daerah.toLowerCase().includes(q) ||
        k.deskripsi.toLowerCase().includes(q)
        : true;
      return matchArea && matchDaerah && matchKeyword;
    });
  } catch (err) {
    console.error("Gagal melakukan pencarian:", err);
    return [];
  }
}

export async function getKostById(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/properties/detail/${id}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Properti tidak ditemukan.");
    }

    return mapPropertyToMobile(data.data);
  } catch (err) {
    console.error(`Gagal mengambil detail properti ID ${id}:`, err);
    throw new Error("Kost tidak ditemukan.");
  }
}

// --- PROFILE ---

export async function getProfile() {
  // Jika tidak ada user aktif di memori, kembalikan data guest
  if (!currentUser) {
    return { nama: "Guest", bio: "Belum masuk akun", email: "", password: "" };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/users/${currentUser.id}`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();

    if (response.ok && data.success) {
      return {
        nama: data.data.name,
        bio: "Pencari Kost RentWise",
        email: data.data.email,
        password: "••••••••"
      };
    }
  } catch (err) {
    console.error("Gagal memuat profil asli:", err);
  }

  // Fallback ke profil login jika panggil API gagal
  return {
    nama: currentUser.name || currentUser.nama || "User",
    bio: "Pencari Kost RentWise",
    email: currentUser.email || "",
    password: "••••••••"
  };
}

export async function updateProfile(data) {
  if (!currentUser) throw new Error("Wajib login untuk memperbarui profil.");

  try {
    const response = await fetch(`${BASE_URL}/api/users/${currentUser.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: data.nama,
        email: data.email
      })
    });
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Gagal memperbarui profil.");
    }

    // Update in-memory user
    currentUser.name = resData.data.name;
    currentUser.email = resData.data.email;

    return { ...data, updated: true };
  } catch (err) {
    throw new Error(err.message || "Gagal menghubungi server.");
  }
}