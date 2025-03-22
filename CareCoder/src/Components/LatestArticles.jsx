import React from 'react';

const articles = [
  {
    image: 'https://res.cloudinary.com/upwork-cloud/video/upload/c_scale,w_400/v1686626342/catalog/1668451847845965824/f6pkagsihqxu1qmomdrr.JPEG', // Replace with actual image path
    title: 'Disease detection, check up in the laboratory',
    description: 'In this case, the role of the health laboratory is very important to do a disease disease detection...',
    link: '#',
  },
  {
    image: 'https://www.mckinsey.com/~/media/mckinsey/industries/healthcare%20systems%20and%20services/our%20insights/german%20healthcare%20in%20the%20postpandemic%20era%20physician%20insights/german-healthcare-in-the-postpandemic-era-1536x1536.jpg?mw=677&car=42:25', // Replace with actual image path
    title: 'Herbal medicines that are safe for consumption',
    description: 'Herbal medicine is very widely used at this time because of its very good for your health...',
    link: '#',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWrIyNMyMtiWf3gdC5naKcPpjtyN02IrjuMQ&s', // Replace with actual image path
    title: 'Natural care for healthy facial skin',
    description: 'A healthy lifestyle should start from now and also for your skin health. There are some...',
    link: '#',
  },
];

export default function LatestArticles() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4">Check out our latest article</h2>
        <div className="w-16 h-[2px] bg-gray-400 mx-auto mb-8"></div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-10">
          {articles.map((article, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl text-left font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 text-left mb-4">{article.description}</p>
                <a href={article.link} className="text-green-600 hover:text-green-800  flex items-center">
                  Read more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12">
        <a
            href="#"
            className="relative inline-flex items-center justify-center p-4 px-6 py-2 my-5 overflow-hidden font-medium text-indigo-600 transition duration-1000 ease-all border-2 border-green-500 rounded-md shadow-md hover:shadow-2xl hover:shadow-black group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-green-500 group-hover:translate-x-0 ease">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-green-500 transition-all duration-300 transform group-hover:translate-x-full ease">
              View All
            </span>
            <span className="relative invisible">Button Text</span>
          </a>
        </div>
      </div>
    </div>
  );
}
