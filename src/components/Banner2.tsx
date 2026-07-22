import React from "react";
import BannerSection from "./BannerSection";
import { banners } from "./bannerData";

export const Banner2 = () => {
  return <BannerSection banners={banners.slice(2, 4)} />;
};