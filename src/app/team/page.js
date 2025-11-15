import Image from "next/image";

export default function Team() {
  return (
    <section className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold text-leaf-600">Meet Our Team</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
          <p className="text-sm">Founder, Herbalist, & Medicine Man</p>
        </div>

        {/* Aaron (still placeholder unless you want his image too) */}
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="w-24 h-24 bg-leaf-50 rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Aaron Bloom</h3>
          <p className="text-sm">Logistics Director</p>
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
          <p className="text-sm">Web Developer</p>
        </div>
      </div>
    </section>
  );
}

