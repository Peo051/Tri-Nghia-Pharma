import { PropsWithChildren, ReactNode } from "react";
import { ChevronRight } from "./vectors";
import { Link, To } from "react-router-dom";
import TransitionLink from "./transition-link";

export interface SectionProps {
  title: ReactNode;
  viewMoreTo?: To;
}

export default function Section(props: PropsWithChildren<SectionProps>) {
  return (
    <section className="bg-background py-2">
      <div className="flex items-center justify-between px-4 pb-1">
        <h2 className="text-section-title truncate font-heading">{props.title}</h2>
        {props.viewMoreTo && (
          <TransitionLink
            className="text-[13px] font-semibold text-primary flex items-center space-x-1 cursor-pointer flex-none hover:text-primary-dark transition-colors"
            to={props.viewMoreTo}
          >
            <span>Xem thêm</span>
            <ChevronRight />
          </TransitionLink>
        )}
      </div>
      {props.children}
    </section>
  );
}
