import ListingCover from "~/components/listing-cover";

export default function Rooms() {
  const mockListings = [
    {
      listing_id: "001",
      image_url:
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a29lbG58ZW58MHx8MHx8fDA%3D",
      location: "Köln, Deutschland",
      price: 85,
    },
    {
      listing_id: "002",
      image_url:
        "https://images.unsplash.com/photo-1524738258074-f8125c6a7588?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a29lbG58ZW58MHx8MHx8fDA%3D",
      location: "München, Deutschland",
      price: 110,
    },
    {
      listing_id: "003",
      image_url:
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVybGlufGVufDB8fDB8fHww",
      location: "Berlin, Deutschland",
      price: 95,
    },
    {
      listing_id: "004",
      image_url:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFtYnVyZ3xlbnwwfHwwfHx8MA%3D%3D",
      location: "Hamburg, Deutschland",
      price: 100,
    },
    {
      listing_id: "005",
      image_url:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFtYnVyZ3xlbnwwfHwwfHx8MA%3D%3D",
      location: "Frankfurt, Deutschland",
      price: 120,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-10">
      {mockListings.map((data) => {
        return (
          <ListingCover
            key={data.listing_id}
            price={data.price}
            image_url={data.image_url}
            location={data.location}
            listing_id={data.listing_id}
          ></ListingCover>
        );
      })}
    </div>
  );
}
