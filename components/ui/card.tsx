import * as React from "react"

import { cn } from "@/lib/utils"

// const Card = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
  
// ))

type LostObject = {
  object_id: string;
  object_name: string;
  type: 'lost' | 'found';
  description: string;
  closed: boolean;
  post_by: string;
  category_id: string;
  in_district: string;
  post_time: Date;
  happen_time: Date;
  address: string;
  image: string;
};

type Props = {
  post: LostObject;
  onClick: (id: number) => void;
};

const Card: React.FC<Props> = ({ post, onClick }) => {
  return (
    <div key={post.object_id} onClick={() => onClick(parseInt(post.object_id))} className="mb-4 p-4 bg-gray-100 rounded">
      <div className="flex">
        <div className="w-2/3">
          <h3 className="font-semibold">{post.object_name}</h3>
          <span className={`inline-block px-2 py-1 text-xs rounded ${post.type === 'lost' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {post.type}
          </span>
          <p className="text-sm text-white-700 mt-2">{post.description}</p>
          <div className="mt-2">
            <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
              {post.in_district}
            </span>
            <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
              {post.category_id}
            </span>
          </div>
        </div>
        <div className="w-1/3 ml-4">
          <img src={post.image} alt={post.object_name} className="w-full h-auto rounded" />
        </div>
      </div>
    </div>
  );
};
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }