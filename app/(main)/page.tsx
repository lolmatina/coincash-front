"use client";

import { Button, Container, Section } from "@/components";
import { TelegramIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import styles from "./page.module.scss";
import clsx from "clsx";
import { Card, getDataArray } from "@/shared/data/secion-2.data";
import { useEffect, useState } from "react";
import { formatAmount, formatPercentage } from "@/shared/utils";
import { NewsCards } from "@/shared/data/news-section";
import Link from "next/link";

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(() => {
    const load = async () => {
      const cards = await getDataArray();
      setCards(cards);
    };
    load();
  }, []);

  return (
    <main>
      <Section className={styles.banner}>
        <Container className={styles.container}>
          <div className={styles.badge}>
            <HugeiconsIcon icon={TelegramIcon} size={24} />
            <span>Присоединяйтесь в наш Telegram!</span>
          </div>
          <h1>Обмен криптовалют в Бишкеке</h1>
          <h2>Лучший сервис по продаже и покупке криптовалют</h2>
          <p>
            Лучший сервис по продаже и покупке криптовалют (Bitcoin, USDT и др.)
            за доллары и сомы!
          </p>
          <div className={styles.buttonGroup}>
            <Button>
              <span>Начать обмен</span>
            </Button>
            <Link href="/auth/signin">
              <Button variant="secondary">
                <span>Войти</span>
              </Button>
            </Link>
          </div>
          <div className={clsx(styles.badge, styles.secondary)}>
            <HugeiconsIcon icon={UserGroupIcon} />
            <span>Нас уже более 5000</span>
          </div>
        </Container>
        <div className={clsx(styles.blob, styles.blob_1)} />
        <div className={clsx(styles.blob, styles.blob_2)} />
      </Section>

      <Section className={styles.descCards}>
        <Container maxWidth={1024} className={styles.container}>
          <article className={styles.card}>
            <span>5000+ Клиентов</span>
            <p>Нам доверяют более 5,000 человек</p>
          </article>
          <article className={clsx(styles.card, styles.primary)}>
            <span>≈ 5 минут В среднем</span>
            <p>Среднее время выполнения операции</p>
          </article>
          <article className={styles.card}>
            <span>10 сек. Обновления</span>
            <p>Курсы обновляются в реальном времени</p>
          </article>
          <article className={clsx(styles.card, styles.primary)}>
            <span>$2KK+ Объем торгов</span>
            <p>Общий объем обменов за последний месяц</p>
          </article>
        </Container>
      </Section>

      <Section className={styles.section2}>
        <Container className={styles.container}>
          <header>
            <h2>
              Ведущая платформа для <span>покупки и продажи криптовалют</span>
            </h2>
            <p>
              Удобные услуги для торговли и управления цифровыми активами — под
              любые потребности. Надёжная защита ваших средств: автономное
              хранилище, многоуровневое шифрование и круглосуточный контроль
              безопасности.
            </p>
          </header>
          <section className={styles.card__container}>
            {cards.map((_, index) => {
              return (
                <article key={`card-${index}`} className={styles.card}>
                  <header>
                    <span className={styles.title}>{_.title}</span>
                    <span className={styles.subtitle}>{_.subtitle}</span>
                  </header>
                  <div className={styles.details}>
                    <span className={styles.amount}>
                      {formatAmount(_.amount)}$
                    </span>
                    <span>{formatPercentage(_.difference)}%</span>
                    <span className="label sm muted">
                      {new Date(_.last_updated_at * 1000).toLocaleString(
                        "ru-RU"
                      )}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>
        </Container>
      </Section>

      <Section className={styles.banner_2}>
        <Container className={styles.container}>
          <h3 className={styles.title}>
            Ваш надежный партнер для покупки, продажи и обмена криптовалют
          </h3>
          <p>
            Одна из ведущих платформ для обмена криптовалют. Мы предлагаем самые
            быстрые транзакции с минимальными комиссиями, надежную защиту
            данных, возможность покупки криптовалюты с помощью карт, а также ряд
            других преимуществ.
          </p>
        </Container>
      </Section>

      <Section className={styles.news}>
        <Container className={styles.container}>
          <div className={styles.header}>
            <h2>
              Оставайтесь в курсе <span>последних новостей</span>
            </h2>
            <p>Узнайте все о криптовалюте, чтобы начать инвестировать</p>
          </div>
          <div className={styles.content}>
            {NewsCards.map((_, index) => {
              return (
                <article key={`news-card-${index}`} className={styles.card}>
                  <div className={styles.cover} />
                  <p className={styles.title}>{_.title}</p>
                  <p className={styles.description}>{_.description}</p>
                </article>
              );
            })}
          </div>

          <Button className={styles.button}>Смотреть все новости</Button>
        </Container>
      </Section>
    </main>
  );
}
