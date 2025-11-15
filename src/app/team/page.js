import Image from "next/image";
import { Instagram } from "lucide-react";

export default function Team() {
  return (
    <section className="max-w-4xl mx-auto space-y-12">
      
      {/* ===================== */}
      {/* TEAM SECTION          */}
      {/* ===================== */}
      <div>
        <h2 className="text-4xl font-bold text-leaf-600">Meet Our Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Tommy */}
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <Image 
                src="/team/tommy.jpg" 
                alt="Thomas Scott"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>

            <h3 className="text-lg font-semibold">Thomas Scott</h3>
            <p className="text-sm mb-3">Founder, Herbalist, & Medicine Man</p>

            <div className="flex justify-center text-leaf-600">
              <a 
                href="https://instagram.com/changingtheegame"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Aaron */}
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="w-24 h-24 bg-leaf-50 rounded-full mx-auto mb-4" />

            <h3 className="text-lg font-semibold">Aaron Bloom</h3>
            <p className="text-sm mb-3">Logistics Director</p>

            <div className="flex justify-center text-leaf-600">
              <a 
                href="https://instagram.com/PLACEHOLDER"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Luke */}
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <Image 
                src="/team/luke.jpg" 
                alt="Luke DeYesso"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>

            <h3 className="text-lg font-semibold">Luke DeYesso</h3>
            <p className="text-sm mb-3">Web Developer</p>

            <div className="flex justify-center text-leaf-600">
              <a 
                href="https://instagram.com/loliverde99"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ===================== */}
      {/* CREDIBLE AFFILIATES   */}
      {/* ===================== */}
      <div>
        <h2 className="text-3xl font-bold text-leaf-600">Credible Affiliates</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Affiliate 1 */}
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-3">Affiliate One</h3>

            <div className="flex justify-center text-leaf-600">
              <a 
                href="https://instagram.com/affiliate_one"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* Affiliate 2 */}
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-3">Affiliate Two</h3>

            <div className="flex justify-center text-leaf-600">
              <a 
                href="https://instagram.com/affiliate_two"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* Affiliate 3 */}
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-3">Affiliate Three</h3>

            <div className="flex justify-center text-leaf-600">
              <a 
                href="https://instagram.com/affiliate_three"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
