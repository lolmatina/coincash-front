import { Metadata } from "next";

type MenuItem = {
  title: string;
  href: string;
};

type Site = {
  navigation: MenuItem[];
} & Metadata;

export const siteConfig: Site = {
  title: "CoinCash",
  description: "",
  navigation: [
    {
      title: "Главная",
      href: "/",
    },
    {
      title: "About",
      href: "/",
    },
    {
      title: "News",
      href: "/",
    },
    {
      title: "FAQ",
      href: "/",
    },
    {
      title: "Reviews",
      href: "/",
    },
    {
      title: "Contacts",
      href: "/",
    },
  ],
};
