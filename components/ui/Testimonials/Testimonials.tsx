'use client';

export default function Testimonials() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
            The best OCR software for math and science
          </h2>
          <p className="mt-4 text-lg text-zinc-900 max-w-3xl mx-auto">
            Image to LaTeX converter with high-accuracy OCR features developed
            specifically for scientific documents like research papers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="bg-zinc-300 rounded-lg p-6 shadow-lg">
            <p className="text-lg text-black mb-4">"A terrific piece of praise"</p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold mr-3">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 10 7 10zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Name</p>
                <p className="text-sm text-gray-500">Description</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-zinc-300 rounded-lg p-6 shadow-lg">
            <p className="text-lg text-black mb-4">"A fantastic bit of feedback"</p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold mr-3">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 10 7 10zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Name</p>
                <p className="text-sm text-gray-500">Description</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-zinc-300 rounded-lg p-6 shadow-lg">
            <p className="text-lg text-black mb-4">"A genuinely glowing review"</p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold mr-3">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 10 7 10zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Name</p>
                <p className="text-sm text-gray-500">Description</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}