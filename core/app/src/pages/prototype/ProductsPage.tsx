import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Package, Check, Star, DollarSign } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { loadMock } from '@/lib/docs-loader'

interface Product {
  id: number
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  isPopular: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await loadMock('products')
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  return (
    <Container size="lg" className="py-4 sm:py-6 md:py-8" data-screen="products-page">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Browse our product catalog and pricing plans
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative">
                <CardHeader>
                  <Skeleton className="h-5 sm:h-6 w-32 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 sm:h-8 w-24 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`relative hover:shadow-lg transition-all ${
                  product.isPopular ? 'border-primary shadow-md' : ''
                }`}
                data-component="product-card"
                data-entity-id={product.id}
              >
                {product.isPopular && (
                  <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">{product.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">/month</span>
                  </div>

                  <ul className="space-y-1.5 sm:space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
                        <span className="break-words">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full text-sm sm:text-base"
                    variant={product.isPopular ? 'default' : 'outline'}
                    size="sm"
                  >
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
