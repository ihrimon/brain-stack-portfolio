import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Container from "@/components/layout/Container"

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* 404 Text */}
        <h1 className="text-7xl font-black tracking-tight text-primary md:text-8xl">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">Page Not Found</h2>

        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button>
            <Link href="/">Go Home</Link>
          </Button>

          <Button variant="outline">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </motion.div>
    </Container>
  )
}
