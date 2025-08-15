import Image from 'next/image';
import { UserObject } from '../types/user';

interface HeaderProps {
  currentUser: UserObject;
}

export function Header({ currentUser }: HeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-primary-content"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-base-content">
              House Evaluator
            </h1>
          </div>
          <p className="text-lg text-base-content/70 ml-[60px]">
            Find your perfect home by evaluating commute times to the places
            that matter most
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-info/10 backdrop-blur-sm rounded-xl p-3 border border-primary/20">
            {currentUser.picture && (
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring-2 ring-success ring-offset-base-100 ring-offset-2">
                  <Image
                    src={currentUser.picture}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </div>
            )}
            <div className="text-right">
              <p className="text-sm font-semibold text-base-content">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-success font-medium">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
