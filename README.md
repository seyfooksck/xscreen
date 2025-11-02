<div align="center">

# xScreen

Windows için Electron tabanlı ekran görüntüsü ve ekran kaydı aracı (tray uygulaması).

<sub>GitHub: https://github.com/seyfooksck/xscreen</sub>

</div>

---

## ✨ Özellikler
- Sistem tepsisi (tray) ikonu ve sağ tık menü
  - Ekran görüntüsü al (PNG)
  - Ekran kaydını başlat/durdur (MP4)
  - Modern Ayarlar & Galeri penceresi
  - Çıkış
- Oturum açılışında otomatik başlatma
- Kayıt sırasında sağ-alt köşede “Durdur” butonlu mini overlay

### Galeri
- `Photos` ve `Videos` içeriklerini listeler ve önizleme yapar
- Dosyayı açma, klasörde gösterme ve silme

### Ayarlar
- Otomatik başlat aç/kapat
- Sistem sesi kaydı aç/kapat (uygun aygıt gerekebilir)
- FPS: 15 / 30 / 60
- Varsayılan klasör: boş bırakılırsa `%USERPROFILE%\\Documents\\xScreen`
- Kısayollar: Ctrl+Alt+S (görüntü), Ctrl+Alt+R (kayıt)

---

## 🚀 Kurulum ve Çalıştırma (Geliştirme)

```cmd
rem Proje kökünde çalıştırın
npm install
npm run start
```

- Geliştirme modunda Electron başlar ve tepsi ikonu yüklenir.
- Ayarlar/Galeri penceresini tepsi menüsünden açabilirsiniz.

## 📦 Paketleme (Dağıtım)

`electron-builder` ile Windows kurulum paketi oluşturulur:

```cmd
npm run dist
```

- Çıktılar varsayılan olarak `dist/` klasörüne düşer.
- Uygulama simgesi için `assets/icon.ico` kullanmanız önerilir (dosya yoksa paketleme sırasında uyarı alabilirsiniz).

## ⌨️ Kısayollar
- Ctrl+Alt+S → Ekran görüntüsü al
- Ctrl+Alt+R → Kaydı başlat/durdur

## 🗂️ Çıktı Klasörleri
- Fotoğraflar: `%USERPROFILE%\\Documents\\xScreen\\Photos` (PNG)
- Videolar: `%USERPROFILE%\\Documents\\xScreen\\Videos` (MP4)

## ⚙️ Gereksinimler ve Notlar
- Platform: Windows 10/11
- MP4 üretimi için yerleşik `ffmpeg-static` kullanılır; MediaRecorder akışı gerektiğinde FFmpeg ile MP4'e dönüştürülür.
- Sistem sesini kaydetmek için “Stereo Mix” veya sanal bir aygıt (örn. Virtual Audio Cable) gerekebilir. Gerekirse `config.json` içindeki `audioDevice` alanını kullanın.
- Çoklu monitörde şu an varsayılan olarak ilk ekran seçilir. (İsteğe bağlı: ekran seçimi eklenebilir.)

## 🛣️ Yol Haritası
- Ekran/monitör seçimi
- Bölge seçerek görüntü/kayıt
- Paylaşım seçenekleri (kopyala, bulut, link)

## 🤝 Katkıda Bulunma
PR’lar memnuniyetle karşılanır. Açmadan önce lütfen küçük bir konu (issue) oluşturup fikri tartışalım.

Geliştirme için önerilen akış:

```cmd
npm install
npm run start
```

## 📄 Lisans
MIT

## 👤 Yazar
- GitHub: [@seyfooksck](https://github.com/seyfooksck)

> Not: Depo adını farklı kullanacaksanız (ör. `screen-capture`), yukarıdaki GitHub bağlantısını buna göre güncelleyebilirsiniz.
