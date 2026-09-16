import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://ujyncbtbdhpnkkijvhpc.supabase.co'
const supabaseKey = 'sb_publishable_iJshAFh-PyLitVf19Pmf4w_Vzs8s67K'

const supabase = createClient(supabaseUrl, supabaseKey)
const container = document.querySelector('#proyek-container')
const form = document.querySelector('#contactForm')

async function tampilkanProyek() {
  const { data: proyek, error } = await supabase
    .from('proyek')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Gagal mengambil data:', error.message)
    container.innerHTML = '<p class="project-status">Supabase tidak dapat diakses. Jalankan lewat Live Server.</p>'
    return
  }

  if (!proyek?.length) {
    container.innerHTML = '<p class="project-status">Belum ada proyek di Supabase.</p>'
    return
  }

  tampilkanDaftarProyek(proyek)
}

function tampilkanDaftarProyek(daftarProyek) {
  container.replaceChildren(...daftarProyek.map((item) => {
    const card = document.createElement('article')
    card.className = 'project-card'
    const judul = item.judul ?? item.title ?? 'Tanpa judul'
    const imageValue = item.gambar_url ?? item.gambar ?? item.image_url ?? item.foto ?? item.thumbnail ?? item.gambar_proyek ?? item.url_gambar
    const imageUrl = buatUrlGambar(imageValue)
    const title = document.createElement('h3')
    title.textContent = judul
    const description = document.createElement('p')
    description.textContent = item.deskripsi ?? item.description ?? ''
    card.append(title, description)

    if (imageUrl) {
      const image = document.createElement('img')
      image.className = 'project-img'
      image.src = imageUrl
      image.alt = `Foto proyek: ${judul}`
      image.loading = 'lazy'
      image.addEventListener('error', () => {
        image.remove()
        const imageError = document.createElement('small')
        imageError.className = 'project-image-error'
        imageError.textContent = 'URL gambar Supabase tidak valid'
        card.prepend(imageError)
      }, { once: true })
      card.prepend(image)
    }

    return card
  }))
}

function buatUrlGambar(nilaiGambar) {
  if (!nilaiGambar) return ''
  if (/^(https?:|data:|blob:)/i.test(nilaiGambar)) return nilaiGambar
  if (nilaiGambar.startsWith('../') || nilaiGambar.startsWith('/')) return nilaiGambar
  return `../${nilaiGambar}`
}

tampilkanProyek()

form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const nama = document.querySelector('#namaInput').value
  if (nama === '') {
    alert('Nama wajib diisi!')
    return
  }
  const { error } = await supabase
    .from('pesan')   // tabel baru, khusus pesan masuk
    .insert([{ nama: nama }])
  if (error) alert('Gagal mengirim pesan')
  else alert('Pesan terkirim, ' + nama + '!')
})



