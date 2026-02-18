export default function Footer() {
  return (
    <footer className="mt-16 bg-green-950 py-10 text-green-50">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">Smart Kirana Store</h3>
          <p className="mt-2 text-sm text-green-100">Fresh groceries delivered to your doorstep.</p>
        </div>
        <div>
          <h4 className="font-medium">Contact</h4>
          <p className="mt-2 text-sm">+91 98765 43210</p>
          <p className="text-sm">support@smartkirana.store</p>
        </div>
        <div>
          <h4 className="font-medium">Address</h4>
          <p className="mt-2 text-sm">12 Market Road, Bengaluru, India</p>
        </div>
      </div>
    </footer>
  );
}
