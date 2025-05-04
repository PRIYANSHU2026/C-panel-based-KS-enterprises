import { redirect } from 'next/navigation';
import { categories } from '@/lib/data';

type CategoryPageProps = {
  params: {
    id: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((cat) => cat.id === params.id);

  if (!category) {
    return <div className="container mx-auto py-12 px-4 text-center">Category not found</div>;
  }

  // Redirect to the appropriate division page based on the category ID
  switch (params.id) {
    case 'robotic-lawn-mower':
      return redirect('/category/robotic-lawn-mower');
    case 'garden-tools':
      return redirect('/category/garden-tools');
    case 'forest-tools':
      return redirect('/category/forest-tools');
    case 'maintenance-division':
      return redirect('/category/maintenance-division');
    case 'einhell-hub':
      return redirect('/category/einhell-hub');
    default:
      return (
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">{category.name}</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
            Explore our range of {category.name.toLowerCase()} designed for professional performance and reliability.
          </p>

          {/* Display subcategories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2">{subcategory.name}</h3>
                <p className="text-gray-600 mb-4">
                  Professional quality {subcategory.name.toLowerCase()} for all your needs.
                </p>
                <a
                  href={`/category/${category.id}/${subcategory.id}`}
                  className="text-red-600 font-medium hover:underline"
                >
                  View Products
                </a>
              </div>
            ))}
          </div>
        </div>
      );
  }
}
