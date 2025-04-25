import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    setIsClicked(true);
    signIn("github");
  };

  // Handle session check for redirect
  useEffect(() => {
    if (session) {
      router.replace("/LandingPage");
    }
  }, [session, router]);

  // Handle video loading
  useEffect(() => {
    const videoElement = document.getElementById("background-video");

    // Define the handler function outside so we can reference it for removal
    const handleVideoLoad = () => {
      setVideoLoaded(true);
      setIsLoading(false);
    };

    if (videoElement) {
      // Add event listener for video loading
      videoElement.addEventListener("loadeddata", handleVideoLoad);

      // Check if video is already loaded
      if (videoElement.readyState >= 2) {
        handleVideoLoad();
      }

      // Fallback timer to handle cases where video events might not fire properly
      const loadingTimeout = setTimeout(() => {
        if (!videoLoaded && videoElement.readyState >= 2) {
          handleVideoLoad();
        }
      }, 2000);

      // Clean up function
      return () => {
        videoElement.removeEventListener("loadeddata", handleVideoLoad);
        clearTimeout(loadingTimeout);
      };
    }
  }, []); // Don't include videoLoaded in dependencies to prevent loops

  function getRandomDuration() {
    return `${Math.random() * 2 + 1}s`;
  }

  function getRandomDelay() {
    return `${Math.random() * 2}s`;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0">
      {/* Fixed Video Background */}
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex bg-black flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => {
                const randomSize = Math.random() * 3 + 1;
                const randomTop = Math.random() * 100;
                const randomLeft = Math.random() * 100;
                const randomOpacity = Math.random() * 0.8 + 0.2;
                const animationDuration = getRandomDuration();
                const animationDelay = getRandomDelay();

                return (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${randomSize}px`,
                      height: `${randomSize}px`,
                      top: `${randomTop}%`,
                      left: `${randomLeft}%`,
                      opacity: randomOpacity,
                      animation: `opacity ${animationDuration} ease-in-out ${animationDelay} infinite`,
                    }}
                  ></div>
                );
              })}
            </div>

            <div
              className="absolute w-20 h-20 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(to bottom right, #3b82f6, #4f46e5)",
              }}
            >
              <div
                className="absolute w-full h-full rounded-full bg-black opacity-20"
                style={{
                  top: "4px",
                  left: "4px",
                }}
              ></div>
            </div>

            <div
              className="absolute w-32 h-32 border border-purple-500 rounded-full top-1/2 left-1/2"
              style={{
                transform: "translate(-50%, -50%)",
                animation: "spin 8s linear infinite",
              }}
            ></div>

            <div
              className="absolute w-40 h-40 border border-blue-400 rounded-full top-1/2 left-1/2"
              style={{
                transform: "translate(-50%, -50%)",
                animation: "spin 12s linear infinite",
              }}
            ></div>

            <div
              className="absolute w-6 h-6 bg-gray-300 rounded-full"
              style={{
                top: "calc(50% - 3px)",
                left: "calc(50% - 3px)",
                animation: "orbit 8s linear infinite",
                transformOrigin: "calc(50% + 20px) calc(50% + 20px)",
              }}
            ></div>
          </div>
          <p className="text-white mt-6 text-xl font-light">
            Loading AstriVerse...
          </p>
        </div>
      ) : null}

      <div className="fixed inset-0 w-full h-full z-0 m-0 p-0">
        <video
          id="background-video"
          autoPlay
          loop
          muted
          playsInline
          className={`object-cover w-full h-full transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ margin: 0, padding: 0 }}
        >
          <source
            src="https://videos.pexels.com/video-files/20481078/20481078-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
              AstriVerse
            </h1>
            <p className="text-gray-200 mb-8">
              Explore the universe beyond limits
            </p>

            {!session && (
              <>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-opacity-50">
                    <p className="text-lg text-white">
                      Explore the universe with stunning 2D and 3D maps—your
                      cosmic journey starts here.
                    </p>
                  </div>

                  <button
                    onClick={handleSignIn}
                    disabled={isClicked}
                    className={`w-full cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r ${
                      isClicked
                        ? "from-indigo-800 to-blue-800 cursor-not-allowed"
                        : "from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
                    } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform ${
                      !isClicked && "hover:scale-105"
                    }`}
                  >
                    {isClicked ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white mt-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Login with GitHub</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 w-full text-center text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} AstriVerse | Explore Beyond</p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }

        @keyframes opacity {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
