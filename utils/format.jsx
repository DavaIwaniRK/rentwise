export function formatRupiah(value) {
  if (value === null || value === undefined) return "Rp 0";
  return "Rp " + Number(value).toLocaleString("id-ID");
}

// Format harga sewa per bulan, contoh: 1300000 -> "Rp 1.300.000/Bulan"
export function formatHargaBulanan(value) {
  return `${formatRupiah(value)}/Bulan`;
}

// Format jarak dalam meter, contoh: 1450 -> "1.5km", 800 -> "800m"
export function formatJarak(meter) {
  if (meter >= 1000) {
    return `${(meter / 1000).toFixed(1)}km`;
  }
  return `${meter}m`;
}

// Format tanggal ISO jadi "8 Juli 2026"
export function formatTanggal(isoString) {
  const bulanList = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const date = new Date(isoString);
  return `${date.getDate()} ${bulanList[date.getMonth()]} ${date.getFullYear()}`;
}