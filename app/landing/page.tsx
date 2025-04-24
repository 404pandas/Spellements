import { getCurrentUser, getAllProducts } from '@/lib/dal'
import Link from 'next/link'
import Button from '../components/ui/Button'
import { PlusIcon } from 'lucide-react'
import Element from '../components/Element'

import { Product } from '@/lib/types'

export default async function DashboardPage() {
  await getCurrentUser()
  const products: Product[] = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Element
          id={1}
          symbol="H"
          name="Hydrogen"
          atomicNumber={1}
          atomicMass={1.0079}
          group={1}
          period={1}
          category="Nonmetal"
          phase="Gas"
          discoveredBy="Henry Cavendish"
          appearance="Colorless gas"
          density={0.00008988}
          meltingPoint={13.99}
          boilingPoint={20.27}
        />{' '}
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              Add To Cart{' '}
            </span>
          </Button>
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-3">Created</div>
          </div>

          {/* Product rows */}
          <div className="divide-y divide-gray-200 dark:divide-dark-border-default">
            {products.map((product: Product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-5 font-medium truncate">
                    {product.name}
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-5 font-medium truncate">
                    {product.description}
                  </div>
                  <div className="col-span-2">{product.price}</div>
                  <div className="col-span-3">{product.material}</div>
                  <div className="col-span-3">Product Sizes</div>
                  {product.sizes.map((size) => (
                    <div key={size} className="col-span-3">
                      {size}
                    </div>
                  ))}
                  <div className="col-span-3">{product.print_type}</div>
                  <div className="col-span-3">{product.print_location}</div>
                  <div className="col-span-3">{product.style}</div>
                  {product.product_care_instructions.map((instruction) => (
                    <div key={instruction} className="col-span-3">
                      {instruction}
                    </div>
                  ))}

                  {product.createdAt && (
                    <div className="col-span-3">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  )}
                  {product.updatedAt && (
                    <div className="col-span-3">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-default rounded-lg bg-white dark:bg-dark-high p-8">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by creating your first product.
          </p>
          <Link href="/products/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                Create Product
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
