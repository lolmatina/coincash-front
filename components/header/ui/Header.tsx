import Container from "@/components/container/ui/Container";
import styles from "./Header.module.scss";
import Image from "next/image";
import Logo from "@/public/static/img/svg/logo.svg";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Image src={Logo} alt="CoinCash Logo" height={40} />
        <Navigation />
      </Container>
    </header>
  );
}
