import React from "react"

export const metadata = {
  title: "Hakkımızda | Çözsen Deneme Kulübü",
  description: "Eğitimde fırsat eşitliğini teknolojiyle harmanlayarak, her öğrencinin potansiyelini keşfetmesini sağlıyoruz.",
}

export default function HakkimizdaPage() {
  return (
    <div className="bg-[#f6fafe] font-body text-[#171c1f] selection:bg-[#fd761a] selection:text-[#5c2400] pb-20">
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#fd761a] text-[#9d4300] text-xs font-bold tracking-widest uppercase font-label">
                VİZYONUMUZ 2024
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold font-headline leading-[1.1] text-[#00152a] tracking-tight">
                Eğitimde Ölçme ve Değerlendirmenin <span className="text-[#9d4300]">Yeni Yüzü</span>
              </h1>
              <p className="text-xl text-[#43474d] leading-relaxed max-w-2xl font-body">
                Sadece bir deneme kulübü değil, akademik başarının mimarıyız. Veriye dayalı analizlerimiz ve uzman kadromuzla öğrencilerin potansiyellerini gerçeğe dönüştürüyoruz.
              </p>
              <div className="flex items-center gap-6">
                <button className="bg-[#9d4300] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                  Hikayemizi Keşfedin
                </button>
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#eaeef2]"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#eaeef2]"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#eaeef2]"></div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-[#00152a] text-white text-[10px] font-bold">
                    +50k
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-square bg-[#f0f4f8] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-3 relative z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Collaborative academic environment"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5bZ5hr0RlnqrDzWGgRBXXpoi7Ao7sbdrUelsO1CDZP6LlkgJrVaX7-9TJ8ZM5K7HT5nfDgdIr_2a_fzkF8shGlweet6WmYDaMlALYKR3g1hTmiqiC5TjjjOWLai7Qdr1jxOTSkFNeE3RwvZDDHl63IZ42TInuQl3PK5UIRnbg4BNKpKWScrZ3_stb5PaxOPIzSiqGaelJiMZc0I8tHQzGmATixu7c3JSeoJ-QLHCKKM0QLOdNftKubevdBC8h2DwP_AmkT3yQC060"
                />
              </div>
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#9d4300]/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#00152a]/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-[#00152a] py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-tighter">120K+</div>
                <div className="text-[#b0c9e8] text-sm font-bold tracking-widest uppercase font-label">Aktif Öğrenci</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-tighter">450+</div>
                <div className="text-[#b0c9e8] text-sm font-bold tracking-widest uppercase font-label">Yıllık Deneme</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-tighter">81</div>
                <div className="text-[#b0c9e8] text-sm font-bold tracking-widest uppercase font-label">İlde Temsilcilik</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-tighter">%98</div>
                <div className="text-[#b0c9e8] text-sm font-bold tracking-widest uppercase font-label">Memnuniyet</div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-32 bg-[#f6fafe]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                    <div className="h-64 bg-[#f0f4f8] rounded-2xl overflow-hidden shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt="Writing paper"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-kGd1KnhBR4kEB4Ns3bdGFgpCCbNWraP1_E9NdFOKC_qaE-pPBe9s7E0FPmR6zaE8YkYeW5qnwh7jvdKmPAQW8BwnEKz-wJ08rKn5dv6BiPMXXsVX-HyanhTRqSguVT9gn0IicRec1KCOLhjdm2lYCx6RWJLBpjMimku2LKXcgYtz9jrNJxpUXh18GyDWIW4GgtdDMasgTp_jAyZIaAYvJI1q8OQRAzRw5wKmICvxKw1gik-ExqqxuV0AKZo4YdU8Zeqe80pE-fRk"
                      />
                    </div>
                    <div className="h-48 bg-[#fd761a] rounded-2xl p-6 flex flex-col justify-end">
                      <p className="font-bold text-[#5c2400] leading-tight text-xl">💡 Yenilikçi Yaklaşım</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-48 bg-[#102a43] rounded-2xl p-6 flex flex-col justify-end">
                      <p className="font-bold text-white leading-tight text-xl">✅ Akademik Güven</p>
                    </div>
                    <div className="h-64 bg-[#f0f4f8] rounded-2xl overflow-hidden shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt="Analysis charts"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm8EVEwe-qUWRmhKO80eeA1WcNL_rJak1g-jA9JFnf2VemMGWEs953QuS_5IAv_tey_1lRGWz2UUbRGZI7pl6Yf8UcooPbocBQjk2THSSZDgGJv-q6l3CE4_oABGhzBmrZNEtvgLTrcWJZNicTFZ4g_oNXWXyjSoTZhUGd0mRKMTGbjZy_u9PK8HEZh4CFHgU3x-_WlOLwRwAB-dYp1jRai9gF1cBFQtBirLoMUMEOpzktXmv6icCBjm9ZaG6ekOb3JT-zrIoC7onk"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <h2 className="text-4xl font-extrabold font-headline text-[#00152a] tracking-tight">Neden Buradayız?</h2>
                <div className="space-y-6">
                  <div className="p-8 bg-white rounded-2xl border-l-4 border-[#9d4300] shadow-sm">
                    <h3 className="text-xl font-bold font-headline mb-3 text-[#00152a]">Misyonumuz</h3>
                    <p className="text-[#43474d] leading-relaxed">
                      Eğitimde fırsat eşitliğini teknolojiyle harmanlayarak, her öğrencinin kendi potansiyelini en doğru verilerle keşfetmesini sağlamak.
                    </p>
                  </div>
                  <div className="p-8 bg-white rounded-2xl border-l-4 border-[#00152a] shadow-sm">
                    <h3 className="text-xl font-bold font-headline mb-3 text-[#00152a]">Vizyonumuz</h3>
                    <p className="text-[#43474d] leading-relaxed">
                      Türkiye'nin en güvenilir dijital ölçme ve değerlendirme platformu olarak, küresel standartlarda bir eğitim ekosistemi kurmak.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid "Neden Biz?" */}
        <section className="py-32 bg-[#f0f4f8]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-extrabold font-headline text-[#00152a] tracking-tight">Çözsen Farkı</h2>
              <p className="text-[#43474d] max-w-2xl mx-auto">
                Standartların ötesinde, her detayı titizlikle düşünülmüş bir öğrenme deneyimi sunuyoruz.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="md:col-span-2 bg-white p-10 rounded-[2rem] flex flex-col md:flex-row gap-10 items-center overflow-hidden relative">
                <div className="flex-1 space-y-6 relative z-10">
                  <div className="w-14 h-14 bg-[#003010] text-[#1aa54c] rounded-2xl flex items-center justify-center text-2xl">
                    🧠
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-[#00152a]">Akademik Hassasiyet</h3>
                  <p className="text-[#43474d] leading-relaxed">
                    Sorularımız, ÖSYM standartlarında, alanında uzman akademisyenler ve deneyimli öğretmen kadromuz tarafından hazırlanır.
                  </p>
                </div>
                <div className="flex-1 w-full h-full min-h-[250px] relative">
                  <div className="absolute inset-0 bg-[#f0f4f8] rounded-2xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Office working"
                      className="w-full h-full object-cover opacity-60"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1z5Q_g_xkQGgLyHjqFGADt5Uwk3KiuugVlYLmVxtxvrbQVF9CzsujMsKjcUsKfhaGwBwIjo6aEG68f0wwW6HbJLQvR67jn0XykB2hEaxNPemH1ab3kZantzcO0q52LrGzbgjGAQbBscC75Rq6c6by0x3rZ2FJNXDNQ2XIj81MBX1IpgWFg_KbSQs08TzwiAU0zwp022ZBN20mZOHd-A2HbpLRK1fDO9K3hb3Xt1mfL3Vb7GfRqBLz1c_7UmI7uNxs3bFvzVYy1WOl"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#00152a] p-10 rounded-[2rem] text-white space-y-8 flex flex-col justify-between">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                  📈
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-headline">Yapay Zeka Destekli Analiz</h3>
                  <p className="text-[#b0c9e8]/80 leading-relaxed text-sm">
                    Hata analizleri ve gelişim tabloları ile eksiklerinizi anında tespit ediyoruz.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#9d4300] p-10 rounded-[2rem] text-white space-y-8 flex flex-col justify-between">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                  👥
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-headline">Geniş Katılımlı Türkiye Geneli</h3>
                  <p className="text-[#ffdbca]/80 leading-relaxed text-sm">
                    Gerçek sınav provasını on binlerce rakibinizle aynı anda yaşayın.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="md:col-span-2 bg-white p-10 rounded-[2rem] flex flex-col md:flex-row-reverse gap-10 items-center overflow-hidden">
                <div className="flex-1 space-y-6">
                  <div className="w-14 h-14 bg-[#f0f4f8] text-[#00152a] rounded-2xl flex items-center justify-center text-2xl">
                    🚀
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-[#00152a]">Kesintisiz Altyapı</h3>
                  <p className="text-[#43474d] leading-relaxed">
                    En yoğun sınav günlerinde bile kasmayan, modern ve hızlı bir teknolojik deneyim sunuyoruz.
                  </p>
                </div>
                <div className="flex-1 w-full h-full min-h-[250px] relative">
                  <div className="absolute inset-0 bg-[#f0f4f8] rounded-2xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Server room"
                      className="w-full h-full object-cover opacity-60"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-33uofG13e3Z7TBNqG5cA3wuQLDZqnZbDdLknDMXF8Dcp3kgvGO3s132XPLhBPEdmqAgcHmgeLlcrix0Ui_YG3nFGLhqY3kiXPVUKWU9rKA7vCEx6XxGpP_qnpmD9Jf5rn4-ATwu4iuo9Qaqe12zVUryXBf8PAW1wN1UlRRLdSX0vFLSUMlZmU4f6JXmvAGT9VoQwO0uEeaT0irwCv0Pd12fAL428xVFHPbbgmpm5Qi886Bwzv-woe-h-dgjxec3JCkrgjRClT1Z3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[#43474d] font-bold tracking-widest uppercase text-xs mb-12 font-label">
              GÜVEN VEREN İŞ ORTAKLARIMIZ
            </p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="h-10 w-32 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">PARTNER 1</div>
              <div className="h-10 w-32 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">PARTNER 2</div>
              <div className="h-10 w-32 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">PARTNER 3</div>
              <div className="h-10 w-32 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">PARTNER 4</div>
              <div className="h-10 w-32 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">PARTNER 5</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
