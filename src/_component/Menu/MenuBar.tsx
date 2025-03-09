'use client'

import { Menu } from 'lucide-react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollMenu } from './MenuScroll'

export function MenuBar() {


  return (
    <Drawer>
      <DrawerTrigger asChild className='content-center'>
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className='hidden'>
            <DrawerTitle></DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ScrollMenu/>
            <div className="mt-3 h-[120px]"></div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

