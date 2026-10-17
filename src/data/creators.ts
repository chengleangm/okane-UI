import type { Creator } from '@/types/creator';
// Original names follow the supplied design; additional names are fictional demo examples.
// All profile details and photos are illustrative, not verified creator identities.
export const creators: Creator[] = [
 {slug:'neary-na-nary',name:'Neary Na Nary',category:'Lifestyle',image:'/images/neary.jpg',description:'Everyday moments, personal style, and stories with a little extra color.'},
 {slug:'ambrel',name:'Ambrel',category:'Travel',image:'/images/ambrel.jpg',description:'Fresh perspectives, open roads, and stories from the places in between.'},
 {slug:'kalucas',name:'Kalucas',category:'Food & culture',image:'/images/kalucas.jpg',description:'Good food, local discoveries, and culture worth sharing.'},
 {slug:'michie',name:'Michie',category:'Entertainment',image:'/images/michie.jpg',description:'Big personality and feel-good stories that bring people together.'},
 {slug:'gabriel',name:'Gabriel',category:'Fashion',image:'/images/gabriel.jpg',description:'Individual style and a creative eye for the unexpected.'},
 {slug:'sophea',name:'Sophea',category:'Lifestyle',image:'/images/sophea.jpg',description:'Everyday routines, small business discoveries, and approachable product stories.'},
 {slug:'dara',name:'Dara',category:'Food & culture',image:'/images/dara.jpg',description:'Cafe visits, local flavors, and welcoming stories for food-loving audiences.'},
 {slug:'sreypov',name:'Sreypov',category:'Fashion',image:'/images/sreypov.jpg',description:'Personal styling, outfit inspiration, and thoughtful product showcases.'},
 {slug:'vannak',name:'Vannak',category:'Travel',image:'/images/vannak.jpg',description:'Weekend escapes, outdoor experiences, and a curious look at new places.'},
 {slug:'lina',name:'Lina',category:'Lifestyle',image:'/images/lina.jpg',description:'Creative home ideas, daily favorites, and relatable stories for growing brands.'},
 {slug:'piseth',name:'Piseth',category:'Entertainment',image:'/images/piseth.jpg',description:'Playful short-form ideas, friendly conversations, and energetic storytelling.'},
 {slug:'kanika',name:'Kanika',category:'Food & culture',image:'/images/kanika.jpg',description:'Fresh food discoveries, local traditions, and the people behind small businesses.'},
];
export const getCreator = (slug: string) => creators.find(c => c.slug === slug);
