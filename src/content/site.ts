export const siteConfig = {
  name: "Çözsen Deneme Kulübü",
  description: "Türkiye geneli denemelerle seviyeni ölç, sınava planlı hazırlan.",
  mainNav: [
    { title: "Paketler", href: "/paketler" },
    { title: "Paketini Kendin Seç", href: "/paketini-kendin-sec" },
    { title: "Erken Kayıt", href: "/erken-kayit" },
    { title: "Nasıl Çalışır", href: "/#nasil-calisir" },
    { title: "Hakkımızda", href: "/hakkimizda" },
  ],
  links: {
    login: "/panel-giris",
    answerKey: "/cevap-anahtari"
  }
}

export type SiteConfig = typeof siteConfig
