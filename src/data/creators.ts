import type { Creator } from '@/types/creator';
// Names follow the supplied design; all profile details and photos are demo content.
export const creators: Creator[] = [
 {slug:'neary-na-nary',name:'Neary Na Nary',category:'Lifestyle',image:'/images/neary.jpg',description:'Everyday moments, personal style, and stories with a little extra color.'},
 {slug:'ambrel',name:'Ambrel',category:'Travel',image:'/images/ambrel.jpg',description:'Fresh perspectives, open roads, and stories from the places in between.'},
 {slug:'kalucas',name:'Kalucas',category:'Food & culture',image:'/images/kalucas.jpg',description:'Good food, local discoveries, and culture worth sharing.'},
 {slug:'michie',name:'Michie',category:'Entertainment',image:'/images/michie.jpg',description:'Big personality and feel-good stories that bring people together.'},
 {slug:'gabriel',name:'Gabriel',category:'Fashion',image:'/images/gabriel.jpg',description:'Individual style and a creative eye for the unexpected.'},
];
export const getCreator = (slug: string) => creators.find(c => c.slug === slug);
