'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { FitnessPhotoMilestone } from '@/lib/fitness/types'

export default function PhotoTimeline({ items }: { items: FitnessPhotoMilestone[] }) {
  const [broken, setBroken] = useState<Record<string, boolean>>({})

  return (
    <div className="fitness-photo-strip">
      {items.map((item) => {
        const showPlaceholder = !item.imagePath || broken[item.id]
        return (
          <article className="fitness-photo-card" key={item.id}>
            <div className="fitness-photo-frame">
              {showPlaceholder ? (
                <div className="fitness-photo-placeholder">{item.label}</div>
              ) : (
                <Image
                  src={item.imagePath as string}
                  alt={`${item.label} physique progress`}
                  fill
                  sizes="(max-width: 900px) 50vw, 20vw"
                  onError={() => setBroken((state) => ({ ...state, [item.id]: true }))}
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
            <div className="fitness-photo-meta">
              <h4>{item.label}</h4>
              <p>{item.weightKg}kg | {item.bodyFat}% body fat</p>
              <span>{item.note}</span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
