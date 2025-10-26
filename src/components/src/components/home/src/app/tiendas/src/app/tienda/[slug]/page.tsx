import VendorProducts from './vendor-products';

export default function Page({ params }: { params: { slug: string } }) {
  return <VendorProducts slug={params.slug} />;
}
