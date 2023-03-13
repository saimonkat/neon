'use client';

import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import ChevronRight from 'icons/chevron-right-sm.inline.svg';

const LinksWithLogos = ({ children = null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <ul className="not-prose !my-10 flex flex-wrap gap-5 !p-0">
        {React.Children.map(children, (child, index) => {
          const {
            children: {
              props: { alt, src, title },
            },
            href,
          } = child.props?.children.props ?? {};
          const isHiddenItem = index > 3 && !isOpen;

          return (
            <li
              className={clsx(
                'flex-1 basis-[23%] before:hidden',
                isHiddenItem ? 'hidden' : 'block'
              )}
            >
              <NextLink
                key={index}
                href={href}
                className="block rounded-[10px] border !border-gray-7 p-6 !transition-colors !duration-200 hover:bg-gray-9 dark:hover:bg-gray-1"
              >
                <div className="h-10">
                  <img
                    className="w-auto shrink-0 brightness-0 dark:brightness-100"
                    src={src}
                    width={80}
                    alt={alt + ' logo'}
                    loading={index > 3 ? 'lazy' : 'eager'}
                  />
                </div>
                <h4 className="text-xl font-semibold text-black dark:text-white">{alt}</h4>
                <p className="mt-2 text-sm text-gray-4 dark:text-gray-7">{title}</p>
                <span className="inline-flex items-center text-base font-medium">
                  <span>Learn More</span>
                  <ArrowRightIcon className="ml-1" />
                </span>
              </NextLink>
            </li>
          );
        })}
      </ul>
      <button
        className="mx-auto flex items-center rounded-full bg-gray-9 p-2 font-medium text-black dark:bg-gray-1 dark:text-white"
        onClick={handleClick}
      >
        <span>{isOpen ? 'Hide' : 'Show more'}</span>
        <ChevronRight
          className={clsx(
            'ml-2 block shrink-0 text-black transition-[transform,color] duration-200 dark:text-white',
            isOpen ? 'rotate-270' : 'rotate-90'
          )}
        />
      </button>
    </>
  );
};

LinksWithLogos.propTypes = {
  children: PropTypes.node,
};

export default LinksWithLogos;
