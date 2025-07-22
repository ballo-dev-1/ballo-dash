"use client";

import coverPhoto1 from "@assets/images/covers/1.png";
import coverPhoto2 from "@assets/images/covers/2.png";
import coverPhoto3 from "@assets/images/covers/3.png";
import coverPhoto4 from "@assets/images/covers/4.png";
import coverPhoto5 from "@assets/images/covers/5.png";
import coverPhoto6 from "@assets/images/covers/6.png";
import coverPhoto7 from "@assets/images/covers/7.png";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import { ArrowRightLeft } from "lucide-react";
import "./style.scss";

const HomeBanner = () => {
  const company = useAppSelector(selectCompany);

  const defaultQuotes = [
    coverPhoto1.src,
    coverPhoto2.src,
    coverPhoto3.src,
    coverPhoto4.src,
    coverPhoto5.src,
    coverPhoto6.src,
    coverPhoto7.src,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const sequenceRef = useRef<number[]>([]);
  const pointerRef = useRef(0);

  const shuffle = (arr: number[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    const length = defaultQuotes.length;
    sequenceRef.current = shuffle(Array.from({ length }, (_, i) => i));
    pointerRef.current = 0;
    setActiveIndex(sequenceRef.current[pointerRef.current]);

    const intervalId = setInterval(() => {
      pointerRef.current += 1;
      if (pointerRef.current >= length) {
        sequenceRef.current = shuffle(Array.from({ length }, (_, i) => i));
        pointerRef.current = 0;
      }
      setActiveIndex(sequenceRef.current[pointerRef.current]);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [defaultQuotes.length]);

  return (
    <div>
      <div className="welcome-cover-container rounded-1 position-relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={defaultQuotes[activeIndex]}
            alt="cover photo"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
          />
        </AnimatePresence>
      </div>
      <div className="welcome-company-logo-container">
        <div className="welcome-company-logo">
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt="logo image"
              className="sidebar-company-logo logo-lg landing-logo"
            />
          ) : (
            <svg
              className="sidebar-company-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeMiterlimit="2"
              strokeLinejoin="round"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path
                fillRule="nonzero"
                fill="whitesmoke"
                d="m2 19v-14c0-.552.447-1 1-1 .542 0 4.418 2.028 9 2.028 4.593 0 8.456-2.028 9-2.028.55 0 1 .447 1 1v14c0 .553-.45 1-1 1-.544 0-4.407-2.028-9-2.028-4.582 0-8.458 2.028-9 2.028-.553 0-1-.448-1-1zm1.5-.791 6.449-7.691c.289-.344.879-.338 1.16.012 0 0 1.954 2.434 1.954 2.434l1.704-1.283c.319-.24.816-.168 1.054.154l4.679 6.335v-12.44c-1.58.58-4.819 1.798-8.5 1.798-3.672 0-6.918-1.218-8.5-1.799zm2.657-.834c1.623-.471 3.657-.903 5.843-.903 2.309 0 4.444.479 6.105.98l-3.041-4.117-1.065.802.275.344c.259.323.206.796-.117 1.054-.323.259-.795.207-1.054-.117l-2.591-3.236zm.698-9.534c-1.051 0-1.905.854-1.905 1.905s.854 1.904 1.905 1.904 1.904-.853 1.904-1.904-.853-1.905-1.904-1.905zm0 1.3c.333 0 .604.271.604.605 0 .333-.271.604-.604.604-.334 0-.605-.271-.605-.604 0-.334.271-.605.605-.605z"
              ></path>
            </svg>
          )}
        </div>
        <div className="share-icon">
          <ArrowRightLeft
            size={55}
            strokeWidth={5} // thicker for outer stroke
            color="gray"
            className="position-absolute"
          />

          {/* Foreground Icon */}
          <ArrowRightLeft
            size={55}
            strokeWidth={3}
            color="whitesmoke"
            style={{ zIndex: "2" }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
