import type { Creator } from '@/types/creator';
// Original names follow the supplied design; additional names are fictional demo examples.
// All profile details, follower counts, and photos are illustrative, not verified creator identities or metrics.
export const creators: Creator[] = [
 {slug:'neary-na-nary',rating:4.9,totalViews:45000000,name:'Neary Na Nary',category:'Travel',image:'/images/neary.jpg',socialFollowers:{facebook:120000,tiktok:352000,instagram:12000},description:'35 countries on $30/day 🌍 | Budget travel tips & hidden gems 🎒'},
 {slug:'ambrel',rating:4.9,totalViews:45000000,name:'Ambrel',category:'Travel',image:'/images/ambrel.jpg',socialFollowers:{facebook:68200,tiktok:143000,instagram:21800},description:'Fresh perspectives, open roads, and stories from the places in between.'},
 {slug:'kalucas',rating:4.9,totalViews:45000000,name:'Kalucas',category:'Food & culture',image:'/images/kalucas.jpg',socialFollowers:{facebook:94500,tiktok:228000,instagram:41700},description:'Good food, local discoveries, and culture worth sharing.'},
 {slug:'michie',rating:4.9,totalViews:45000000,name:'Michie',category:'Entertainment',image:'/images/michie.jpg',socialFollowers:{facebook:187000,tiktok:352000,instagram:56300},description:'Big personality and feel-good stories that bring people together.'},
 {slug:'gabriel',rating:4.9,totalViews:45000000,name:'Gabriel',category:'Fashion',image:'/images/gabriel.jpg',socialFollowers:{facebook:73800,tiktok:96400,instagram:82100},description:'Individual style and a creative eye for the unexpected.'},
 {slug:'sophea',name:'Sophea',category:'Lifestyle',image:'/images/sophea.jpg',socialFollowers:{facebook:45600,tiktok:72100,instagram:19400},description:'Everyday routines, small business discoveries, and approachable product stories.'},
 {slug:'dara',name:'Dara',category:'Food & culture',image:'/images/dara.jpg',socialFollowers:{facebook:58200,tiktok:118000,instagram:26700},description:'Cafe visits, local flavors, and welcoming stories for food-loving audiences.'},
 {slug:'sreypov',name:'Sreypov',category:'Fashion',image:'/images/sreypov.jpg',socialFollowers:{facebook:39200,tiktok:87500,instagram:64800},description:'Personal styling, outfit inspiration, and thoughtful product showcases.'},
 {slug:'vannak',name:'Vannak',category:'Travel',image:'/images/vannak.jpg',socialFollowers:{facebook:81300,tiktok:164000,instagram:35200},description:'Weekend escapes, outdoor experiences, and a curious look at new places.'},
 {slug:'lina',name:'Lina',category:'Lifestyle',image:'/images/lina.jpg',socialFollowers:{facebook:52700,tiktok:63500,instagram:28900},description:'Creative home ideas, daily favorites, and relatable stories for growing brands.'},
 {slug:'piseth',name:'Piseth',category:'Entertainment',image:'/images/piseth.jpg',socialFollowers:{facebook:106000,tiktok:295000,instagram:48100},description:'Playful short-form ideas, friendly conversations, and energetic storytelling.'},
 {slug:'kanika',name:'Kanika',category:'Food & culture',image:'/images/kanika.jpg',socialFollowers:{facebook:61700,tiktok:137000,instagram:31600},description:'Fresh food discoveries, local traditions, and the people behind small businesses.'},
];
export const getCreator = (slug: string) => creators.find(c => c.slug === slug);
