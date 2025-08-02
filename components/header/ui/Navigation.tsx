"use client";

import { siteConfig } from "@/app/site";
import Link from "next/link";
import { motion } from "motion/react";
import styles from "./Header.module.scss";
import { useState } from "react";

export default function Navigation() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <nav className={styles.navigation}>
      {siteConfig.navigation.map((elem, index) => {
        return (
          <Link
            onClick={() => setActiveTab(index)}
            key={`nav-item-${index}`}
            href={elem.href}
          >
            <div className={styles.navItem}>
              <span>{elem.title}</span>
              {activeTab === index && (
                <motion.div layoutId="curtain" className={styles.curtain} />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
