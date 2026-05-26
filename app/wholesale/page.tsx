import WholesaleInquiryForm from "./WholesaleInquiryForm";

export default function WholesalePage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
              Wholesale Program
            </p>

            <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
              Bulk Herbal
              <br />
              Partnerships
            </h1>

            <p className="text-zinc-300 text-lg leading-relaxed mb-8">
              Apply for wholesale access to premium herbal products, sea moss,
              stingless bee honey, and wellness goods sourced directly from
              trusted communities.
            </p>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-xl mb-3 text-jungle-300">
                  Wholesale Benefits
                </h3>

                <ul className="space-y-3 text-zinc-300">
                  <li>• Bulk pricing discounts</li>
                  <li>• Private labeling options</li>
                  <li>• Access to limited inventory</li>
                  <li>• Large quantity sea moss ordering</li>
                  <li>• Melipona honey wholesale access</li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-xl mb-3 text-jungle-300">
                  Ideal For
                </h3>

                <ul className="space-y-3 text-zinc-300">
                  <li>• Herbal stores</li>
                  <li>• Wellness shops</li>
                  <li>• Natural product brands</li>
                  <li>• Health practitioners</li>
                  <li>• Online retailers</li>
                </ul>
              </div>
            </div>
          </div>

          <WholesaleInquiryForm />
        </div>
      </div>
    </div>
  );
}
