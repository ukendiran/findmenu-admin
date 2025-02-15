import { Button, Carousel, QRCode } from "antd";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();
  const content = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <QRCode value={"https://findmenu.in"} size={200} color={"#fff"} />
      </div>
    );
  };

  const slides = [
    {
      id: 1,
      title: "FindMenu:Scan, Explore, Savor.",
      content: content,
      description:
        "Discover your next favorite dish with ease! Our app lets you scan restaurant menus, browse through options, and make informed choices — all from your phone. Simplifying your dining experience one scan at a time.",
    },
    {
      id: 2,
      title: "FindMenu:Your Menu, Just a Scan Away.",
      content: content,
      description:
        "Skip the wait and dive into the details! Scan any restaurant menu with our app to instantly view dish descriptions, ingredients, and prices. It's fast, intuitive, and makes ordering easier than ever.",
    },
    {
      id: 3,
      title: "FindMenu:Scan the Menu, Savor the Experience.",
      content: content,
      description:
        "Want to know what's in your meal before you order? Our app allows you to scan restaurant menus to view detailed descriptions, nutritional info, and special recommendations. Make informed choices every time you dine out.",
    },
    {
      id: 4,
      title: "FindMenu:Menu Scanning Made Delicious.",
      content: content,
      description:
        "Uncomplicate your dining experience. With just a scan, get detailed information about each dish, its ingredients, and even customer reviews. Choose with confidence, and enjoy every bite!",
    },
    {
      id: 5,
      title: "FindMenu:Scan. Select. Savor.",
      content: content,
      description:
        "Dining has never been easier. Use our app to scan restaurant menus, view options, and make the perfect choice. No more confusion—just great food, quickly found.",
    },
    {
      id: 6,
      title: "FindMenu:Unlock Your Meal with a Scan.",
      content: content,
      description:
        "Wondering what's on the menu? Just scan and unlock detailed descriptions, photos, and nutritional information for every dish. Make smarter choices and enjoy a hassle-free dining experience",
    },
    {
      id: 7,
      title: "FindMenu:Scan the Menu, Taste the Magic.",
      content: content,
      description:
        "Make every meal memorable! Our app lets you scan restaurant menus, see detailed dish info, and choose your meal based on your preferences. Dining out has never been so simple and enjoyable.",
    },
    {
      id: 8,
      title: "FindMenu:Scan the Menu, Savor the Flavor.",
      content: content,
      description:
        "Get the full scoop on your meal before you order. Our app lets you scan restaurant menus to view detailed descriptions, ingredients, and customer reviews. Make the right choice every time.",
    },
  ];

  const handleSignup = () => {
    navigate("contact");
  };

  return (
    <div>
      <Carousel autoplay effect="fade" speed={2000} autoplaySpeed={5000}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              style={{
                height: "auto", // Full screen height
                padding: "60px 0px",
                backgroundColor: "#074225",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                alignItems: "center", // Vertically center content
                justifyContent: "center", // Horizontally center content
              }}
            >
              <div
                style={{
                  width: "50%",
                  margin: "0px auto",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                {slide.title && (
                  <h1
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      lineHeight: 1.2,
                    }}
                  >
                    {slide.title}
                  </h1>
                )}

                <div style={{ padding: "40px 0px" }}>
                  {slide.content && slide.content()}
                </div>

                {slide.description && (
                  <p
                    style={{
                      fontSize: "1.2rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {slide.description}
                  </p>
                )}

                <Button onClick={handleSignup}>Signup Now!</Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
