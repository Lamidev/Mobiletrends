export const siteConfig = {
  name: "Mobiletrends Systems Limited",
  shortName: "Mobiletrends",
  description: "Your premier destination for the latest smartphones, gadgets, and tech accessories.",
  url: "https://mobiletrends.ng",
  logo: "/logo.jpg",
  contact: {
    phones: ["08034378180", "08142528191"],
    email: "Admin@mobiletrends.ng",
    offices: [
      {
        title: "Office 1",
        address: "Offices 21 & 39 Ogunleye Shopping Complex, Opposite Woleph Hostel, Oba-kekere Futa South gate Entrance, Akure.",
        city: "Akure",
        state: "Ondo State",
        country: "Nigeria",
      },
      {
        title: "Office 2",
        address: "Ground Floor 3, Felicia Mall Complex, adjacent Recabim Mtn office Oba Adesida road, Akure Ondo State, Nigeria",
        city: "Akure",
        state: "Ondo State",
        country: "Nigeria",
      },
    ],
  },
  colors: {
    primary: "#0C1172",
    primaryHover: "#080c52",
    accent: "#DF5E00",
    accentHover: "#b84d00",
  },
  socials: {
    facebook: "https://facebook.com/mobiletrendslimited",
    instagram: "https://instagram.com/mobiletrendslimited",
    twitter: "https://twitter.com/mobiletrends_ng",
    whatsapp: "https://wa.me/2348034378180",
  },
};

export type SiteConfig = typeof siteConfig;

