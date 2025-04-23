import type { FC, PropsWithChildren } from 'hono/jsx';
import DefaultLayout from '../../layouts/default.js';

export interface AboutProps {

}

const About: FC<PropsWithChildren<AboutProps>> = () => {
  return (
    <DefaultLayout title="About">
      <div>
        About Page
      </div>
    </DefaultLayout>
  )
}

export default About;