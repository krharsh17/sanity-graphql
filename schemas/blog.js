import { defineField } from "sanity";

export default{
   name: 'blog',
   type: 'document',
   title: 'Blog',
   fields: [
     defineField( {
         name: 'title',
         title: 'Title',
         type: 'string'          
     }),
     defineField({
         name: 'slug',
         title: 'Slug',
         type: 'slug',
         options: {
             source: 'title',
             maxLength: 96
         }
     }),
     defineField({
         name: 'mainImage',
         title: 'Main image',
         type: 'image',
         options: {
             hotspot: true,
         },
         }),
         defineField({
         name: 'publishedAt',
         title: 'Published at',
         type: 'datetime',
         }),
         defineField({
         name: 'body',
         title: 'Body',
         type: 'blockContent',
         }),
         defineField({
         name: 'views',
         title: 'Views',
         type: 'number',
         }),
         defineField({
         name: 'likes',
         title: 'Likes',
         type: 'number',
         }),
   ],
   initialValue:{
     views: 0,
     likes: 0
   }
}