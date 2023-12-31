import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "../styles/Layout.module.css";

type LayoutProps = {
	children: React.ReactNode;
	pageTitle?: string;
	metaDescription: string;
	showHomeLink?: boolean;
	roomNumber?: string;
	connectedPeople?: string;
	disconnectChannel?: () => void; // New prop for disconnecting from the current channel
};

export default function Layout({
	children,
	pageTitle,
	metaDescription,
	showHomeLink = true,
	roomNumber,
	connectedPeople,
	disconnectChannel,
}: LayoutProps) {
	const headTitle =
		(pageTitle ? `${pageTitle} - ` : "") +
		"Ably and Next.js fundamentals starter kit";
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.rightSide}>
					<span className={styles.logo}></span>
					<div className={styles.links}>
						<span className={styles.link}>Page</span>
						<span className={styles.link}>Login</span>
						<span className={styles.link}>Something</span>
					</div>
				</div>
				<div className={styles.rightSide}>
					{roomNumber ? (
						<div className={styles.roomNumber}>{roomNumber}</div>
					) : (
						""
					)}
					{roomNumber ? (
						<button
							className={styles.disconnectChannel}
							onClick={disconnectChannel}
						>
							Disconnect
						</button>
					) : (
						""
					)}
					{connectedPeople ? (
						<div className={styles.connectedPeople}>
							Connected: {connectedPeople}
						</div>
					) : (
						""
					)}

					<span className={styles.profilePicture}>
						<span className={styles.textInside}>JK</span>
					</span>
				</div>
			</div>

			<main className={styles.main}>
				{/* <h1 className={styles.title}>
          <a href="https://ably.com/?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo">Ably</a> &amp; <a href="https://nextjs.org">Next.js</a> fundamentals
        </h1>
        { showHomeLink && <Link href="/">&larr; Home</Link> }

        {pageTitle && <h2>{pageTitle}</h2>} */}

				{children}
			</main>
			<footer className={styles.footer}>
				Powered by{" "}
				<span className={styles.logo}>
					<a
						href="https://ably.com/?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="https://static.ably.dev/logo-h-mono-black.svg?ably-nextjs-fundamentals-kit"
							alt="Ably Logo"
							width={102}
							height={18}
						/>
					</a>
				</span>
				&amp;
				<span className={styles.logo}>
					<a
						href="https://vercel.com?utm_source=create-next-app&utm_medium=ably-nextjs-fundamentals-kit&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/vercel.svg"
							alt="Vercel Logo"
							width={100}
							height={16}
						/>
					</a>
				</span>
			</footer>
		</div>
	);
}
