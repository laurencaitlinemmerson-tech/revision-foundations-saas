"use client";
import dynamic from 'next/dynamic';

const PlacementSurvivalPage = dynamic(() => import('@/app/hub/resources/placement-survival/page'), { ssr: false });

export default function PlacementSurvivalDashboardCardClient() {
  return <PlacementSurvivalPage />;
}
