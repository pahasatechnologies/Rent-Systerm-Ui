import { User } from './user';

export class Listing {
  address: string;
  id: number;
  latitude: number;
  longitude: number;
  price: number | string;
  thumbnail: string;
  title: string;
  description: string;
  category: string;
  category_id: number;
  is_active: boolean;
  is_featured: boolean;
  user_id: number;
  user: User;
  rating: number;
  reviews: Array<any>;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  country: string;
  state: string;
  pincode: string;
  images: Array<any>;

  constructor() {
    this.images = this.images || [];
  }

}
