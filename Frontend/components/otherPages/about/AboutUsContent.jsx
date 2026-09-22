
"use client";
import Image from "next/image";

export default function AboutUsContent() {
  console.log("Rendering AboutUsContent");


  return (
    <>
      {/* Introduction Section */}
      <section className="tf-section3 section-about-intro">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="content-about" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
               <div className="heading-section" style={{ position: "sticky", top: "100px", zIndex: 10 }}>
                  <h2 className="wow fadeInUpSmall">About UKA Japan Motors</h2>
                  <p className="mt-18 wow fadeInUpSmall" style={{ lineHeight: "1.8", fontSize: "16px" }}>
                    At UKA Japan Motors, we specialize in bringing the most reliable Japanese cars to discerning customers across the United Kingdom. With a passion for quality and a commitment to excellence, we ensure that every import car for sale meets our high standards of performance, reliability, and value.
                  </p>
                  <br/>
                  <p className="mt-16 wow fadeInUpSmall" style={{ lineHeight: "1.8", fontSize: "16px" }}>
                    With over 25 years' experience in the automotive industry, our Japanese import car dealership was established with a vision to make affordable Japanese vehicles accessible to UK enthusiasts and everyday drivers alike. Over the years, we have built a reputation for trust and integrity, consistently delivering quality vehicles for sale and exceptional customer service.
                  </p>
                  <div className="experience-badge">
                  <span className="number">25+</span>
                  <span className="text">Years of Excellence</span>
                </div>
                </div>
                 
              </div>
            </div>
            <div className="col-lg-6">
              <div className="image-about relative">
                
                  <Image
                    className="ls-is-cached lazyloaded detail-image-aboutus"
                    data-src="/assets/images/section/about-japan-motors.jpeg"
                    alt="UKA Japan Motors"
                    src="/assets/images/section/about-japan-motors.jpeg"
                    width={600}
                    height={400}
                   
                  />
                
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="tf-section3 section-why-choose-us bg-gray">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="image-wcs">
                <div className="sticky-image">
                  <Image
                    className="ls-is-cached lazyloaded"
                    data-src="/assets/images/section/why-choose-us.jpg"
                    alt="Why Choose UKA"
                    src="/assets/images/section/why-choose-us.jpg"
                    width={615}
                    height={890}
                    priority
                  />
                </div>
                {/* <div className="floating-card">
                  <div className="card-content">
                    <h4>Trusted by 10,000+ Customers</h4>
                    <p>Across the UK and worldwide</p>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="content-wcs">
                <div className="heading-section">
                  <h2 className="wow fadeInUpSmall">Why Choose Us?</h2>
                  <p className="mt-18 wow fadeInUpSmall">
                    Partner with UKA Japan Motors to access quality Japanese imports and elevate your used car dealership's offerings.
                  </p>
                </div>
                <div className="features-list">
                  <div className="feature-item">
                    <div className="icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#FF7101"/>
                      </svg>
                    </div>
                    <div className="content">
                      <h4>Reputable Brand</h4>
                      <p>Our staff visit Japanese auction houses in person to source second-hand vehicles that stand out in terms of quality and performance, specifically selected for the UK market.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#FF7101"/>
                      </svg>
                    </div>
                    <div className="content">
                      <h4>Unbeatable Prices</h4>
                      <p>Our strong connections and streamlined import process allow us to offer competitive prices that you won't find elsewhere.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#FF7101"/>
                      </svg>
                    </div>
                    <div className="content">
                      <h4>Peace of Mind Warranty</h4>
                      <p>We stand behind the quality of our vehicles. Every car purchased through our UK inventory comes with a comprehensive 3-month warranty.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6H20V16H4V6ZM2 4V18H22V4H2Z" fill="#FF7101"/>
                      </svg>
                    </div>
                    <div className="content">
                      <h4>Extensive Inventory</h4>
                      <p>Low-mileage Japanese cars, including Toyota, Nissan, Mazda, and Suzuki imports. If we don't have the specific model you're looking for, we will source it for you.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#FF7101"/>
                      </svg>
                    </div>
                    <div className="content">
                      <h4>Customer-Centric Approach</h4>
                      <p>Your satisfaction is our priority. Our knowledgeable team is dedicated to providing you with a seamless and enjoyable purchasing experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="tf-section3 section-global-presence">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="heading-section mb-50">
                <h2 className="wow fadeInUpSmall">Global Used Japanese Car Exporter Since 1999</h2>
                <p className="mt-18 wow fadeInUpSmall fs-18">
                  Founded in Japan in 1999, UKA Group has grown into a trusted global supplier of high-quality used Japanese cars.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="global-content">
                <h3>Strong Domestic Network in Japan</h3>
                <p>Our foundation is built on a powerful domestic network within Japan. We operate multiple strategically located automotive yards that serve as sourcing and inspection hubs.</p>

                <div className="network-features">
                  <div className="network-item">
                    <i className="icon-autodeal-check"></i>
                    <span>Hybrid Cars</span>
                  </div>
                  <div className="network-item">
                    <i className="icon-autodeal-check"></i>
                    <span>SUVs & 4x4s</span>
                  </div>
                  <div className="network-item">
                    <i className="icon-autodeal-check"></i>
                    <span>Executive Sedans</span>
                  </div>
                  <div className="network-item">
                    <i className="icon-autodeal-check"></i>
                    <span>Hatchbacks</span>
                  </div>
                  <div className="network-item">
                    <i className="icon-autodeal-check"></i>
                    <span>MPVs & Vans</span>
                  </div>
                  <div className="network-item">
                    <i className="icon-autodeal-check"></i>
                    <span>Commercial Vehicles</span>
                  </div>
                </div>

                <p className="mt-20">
                  Every vehicle is carefully selected under strict Japanese grading standards, verified auction sheets, and detailed inspection reports to ensure quality, performance, and long-term reliability for British roads.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="countries-map">
                <div className="map-placeholder">
                  <div className="countries-list">
                    <div className="country-item">
                      <span className="flag">🇯🇵</span>
                      <span>Japan (HQ)</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇬🇧</span>
                      <span>United Kingdom</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇳🇿</span>
                      <span>New Zealand</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇦🇺</span>
                      <span>Australia</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇰🇪</span>
                      <span>Kenya</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇺🇬</span>
                      <span>Uganda</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇯🇲</span>
                      <span>Jamaica</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇹🇿</span>
                      <span>Tanzania</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇵🇰</span>
                      <span>Pakistan</span>
                    </div>
                    <div className="country-item">
                      <span className="flag">🇦🇪</span>
                      <span>UAE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="tf-section3 section-quality-assurance bg-gray">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="quality-image">
                <Image
                  className="ls-is-cached lazyloaded"
                  data-src="/assets/images/section/quality-assurance.jpg"
                  alt="Quality Assurance"
                  src="/assets/images/section/quality-assurance.jpeg"
                  width={600}
                  height={400}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="quality-content">
                <div className="heading-section">
                  <h2 className="wow fadeInUpSmall">Quality Assured Japanese Vehicles</h2>
                  <p className="mt-18 wow fadeInUpSmall">
                    As a leading Japanese car exporter, we are committed to transparency, durability, and customer satisfaction. Each used Japanese vehicle undergoes:
                  </p>
                </div>

                <div className="quality-checklist">
                  <div className="check-item">
                    <div className="check-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Professional multi-point inspection</span>
                  </div>
                  <div className="check-item">
                    <div className="check-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Full mechanical assessment</span>
                  </div>
                  <div className="check-item">
                    <div className="check-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>UK compliance verification</span>
                  </div>
                  <div className="check-item">
                    <div className="check-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Export-ready preparation</span>
                  </div>
                </div>

                <p className="mt-20">
                  Our efficient inventory management and global logistics network allow us to provide fast international shipping and smooth delivery processes across all our operating countries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brand Section */}
      <section className="tf-section3 section-trusted-brand">
        <div className="container" >
          <div className="trusted-brand-card" style={{background:"#FF7101"}}>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="brand-content">
                  <h2 style={{color:"#fff"}}>A Trusted Global Brand</h2>
                  <p style={{color:"#fff"}}>
                    With over two decades of experience in the automotive export industry, UKA Group has built a reputation based on integrity, expertise, and excellence. Whether you are searching for fuel-efficient hybrid cars, family SUVs, reliable sedans, or commercial vehicles, UKA Japan Motors remains a trusted name in the global used car market. We proudly continue our mission of connecting UK customers with dependable, high-quality Japanese vehicles at competitive prices.
                  </p>
                  <div className="brand-stats">
                    <div className="stat">
                      <span className="number">25+</span>
                      <span className="label">Years in Business</span>
                    </div>
                
                    <div className="stat">
                      <span className="number">100K+</span>
                      <span className="label">Cars Exported</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="brand-image">
                  <Image
                    src="/assets/images/logo/logo.png"
                    alt="Trusted Brand"
                    width={400}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-about-intro {
          padding: 80px 0;
        }

        .content-about {
          padding-right: 40px;
          height:100%;
        }

        .image-about {
          position: relative;
        }

        .experience-badge {
          margin-top: 20px;
          background: linear-gradient(135deg, #FF7101, #0056b3);
          color: white;
          padding: 30px 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }
             :global(.detail-image-aboutus) {
  width: 90% !important;
  height: 100vh !important;
  margin-left: 50px !important;
  object-fit: cover !important;
}


        .experience-badge .number {
          display: block;
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
        }

        .experience-badge .text {
          display: block;
          font-size: 12px;
          opacity: 0.9;
          margin-top: 2px;
        }

        .bg-gray {
          background: #f8f9fa;
        }

        .features-list {
          margin-top: 30px;
        }

        .feature-item {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .feature-item .icon {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          background: #f0f5ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-item .content h4 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .feature-item .content p {
          color: #666;
          line-height: 1.6;
        }

        .image-wcs {
         height: 100%;
  min-height: 100%;
  display: block; 
        }

        .floating-card {
          position: absolute;
          bottom: -120px;
          left: 20px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .sticky-image {
         position: sticky;
  top: 100px;
        }

        .floating-card h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 5px;
          color: #333;
        }

        .floating-card p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .section-global-presence {
          padding: 80px 0;
        }

        .network-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }

        .network-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
        }

        .network-item i {
          color: #28a745;
          font-size: 18px;
        }

        .countries-map {
          height: 100%;
          display: flex;
          align-items: center;
        }

        .map-placeholder {
          width: 100%;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 12px;
          padding: 30px;
          border: 2px dashed #dee2e6;
        }

        .countries-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .country-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }

        .country-item .flag {
          font-size: 20px;
        }

        .section-quality-assurance {
          padding: 80px 0;
        }

        .quality-checklist {
          margin: 30px 0;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
          padding: 10px 0;
        }

        .check-item .check-icon {
          width: 24px;
          height: 24px;
          background: #d4edda;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-trusted-brand {
          padding: 80px 0;
        }

        .trusted-brand-card {
          background: linear-gradient(135deg, #FF7101, #0056b3);
          border-radius: 16px;
          padding: 50px;
          color: white;
        }

        .trusted-brand-card h2 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .trusted-brand-card p {
          font-size: 18px;
          line-height: 1.6;
          opacity: 0.9;
        }

        .brand-stats {
          display: flex;
          gap: 40px;
          margin-top: 30px;
        }

        .brand-stats .stat {
          text-align: center;
        }

        .brand-stats .number {
          display: block;
          font-size: 36px;
          font-weight: 700;
          line-height: 1;
        }

        .brand-stats .label {
          display: block;
          font-size: 14px;
          opacity: 0.8;
          margin-top: 5px;
        }

   
        @media (max-width: 768px) {
          .section-about-intro,
          .section-global-presence,
          .section-quality-assurance,
          .section-trusted-brand {
            padding: 20px 0;
          }

        :global(.detail-image-aboutus) {
    width: 100% !important;
    height: auto !important;
    margin-left: 0 !important;
  }

          .content-about {
            padding-right: 0;
            margin-bottom: 40px;

          }

          .network-features {
            grid-template-columns: 1fr;
          }

          .countries-list {
            grid-template-columns: 1fr;
          }

          .trusted-brand-card {
            padding: 30px 20px;
          }

          .trusted-brand-card h2 {
            font-size: 24px;
          }

          .brand-stats {
            flex-direction: column;
            gap: 20px;
          }

          .features-list .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}