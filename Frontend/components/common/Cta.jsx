"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    id: 1,
    image: "/assets/images/img-box/find-car-1.png",
    title: "Are you looking for a car?",
    description:
      "Save time and effort as you no longer need to visit multiple stores to find the right car.",
    buttonText: "Find cars",
    href: "/listing-grid",
    iconClass: "icon-autodeal-search",
    cardStyle: {
      background: "linear-gradient(135deg, #ff7d00 0%, #ffb200 100%)",
      color: "#ffffff",
    },
    buttonStyle: {
   
       backgroundColor: "#ff7d00",
      color: "#ffffff",
      padding: "14px 60px",
      borderRadius: "7px",
    },
  },
  {
    id: 2,
    title: "Do you want to sell a car?",
    description:
      "Find your perfect car match and sell your car quickly with our user-friendly online service.",
    buttonText: "Contact Us",
    href: "/contact",
    iconClass:"fa-solid fa-phone",
    image: "/assets/images/img-box/find-car-2.png",
    cardStyle: {
      background: "#080808",
      color: "#ffffff",
    },
    buttonStyle: {
      backgroundColor: "#ff7d00",
      color: "#ffffff",
      padding: "14px 50px",
      borderRadius: "7px",
    },
  },
];

export default function Cta() {
  return (
    <section className="tf-section3 cta-section">
      <div className="container">
        <div className="row cta-row">
          {cards.map((card) => (
            <div key={card.id} className="col-lg-6 col-md-12 cta-column">
              <div className="cta-card" style={card.cardStyle}>
                <div className="cta-image">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={240}
                    height={180}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>

                <div className="cta-content" style={{ color: card.cardStyle.color }}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <Link
                    href={card.href}
                    className=" btn-svg btn-55 cta-button"
                    style={card.buttonStyle}
                  >
                    <span style={{fontSize:"1rem", marginRight:"2px", fontWeight:"500"}}>{card.buttonText}</span>
                    <i className={card.iconClass} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .cta-section {
          padding: 100px 0;
        }

        .cta-row {
          display: flex;
          flex-wrap: wrap;
          // gap: 6px;
        }

        .cta-column {
          display: flex;
        }

        .cta-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          padding: 32px;
          border-radius: 30px;
          min-height: 260px;
          width: 100%;
        }

        .cta-image {
          flex: 0 0 320px;
          max-width: 320px;
        }

        .cta-content {
          flex: 1;
        }

        .cta-content h3 {
          font-size: 2rem;
          line-height: 1.1;
          margin-bottom: 18px;
          min-height: 4.4rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cta-content p {
          font-size: 1rem;
          line-height: 1.85;
          max-width: 540px;
          opacity: 0.92;
          margin-bottom: 26px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 99px;
          padding: 14px 28px;
          min-width: 160px;
        }

          .sc-button:hover,
          .sc-button.active{
            background-color: rgb(255, 125, 0);
            color: #ffffff;
            }
            

        @media (max-width: 1300px) {
          .cta-card {
        
            padding: 30px;
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            margin-bottom: 20px;
            min-height: auto;
          }

          .cta-image {
            flex: 0 0 auto;
            max-width: 100%;
            margin: 0 auto;
          }

          .cta-content {
            width: 100%;
          }

          .cta-content p {
            max-width: 100%;
          }

          .cta-button {
            margin: 0 auto;
            width: auto;
          }
        }

       

      

        @media (max-width: 576px) {
          .cta-section {
            padding: 60px 0;
          }

          .cta-card {
            padding: 24px;
            gap: 20px;
          }

          .cta-content h3 {
            font-size: 1.7rem;
          }

          .cta-content p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  );
}
