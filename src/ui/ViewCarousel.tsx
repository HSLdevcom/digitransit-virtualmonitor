import * as React from 'react';

import { Seconds } from '../time';
import {
  IViewBase,
  IViewCarousel,
  IViewCarouselElement,
} from './ConfigurationList';
import View from './Views/View';

interface IProps {
  readonly viewCarousel: IViewCarousel;
}

interface IState {
  carouselTimeout?: number;
  carouselLoopTime: Seconds;
}

class ViewCarousel extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      carouselLoopTime: this.getTotalCarouselTime(),
      carouselTimeout: undefined,
    };
  }

  public componentDidMount() {
    this.setState({
      carouselTimeout: this.createTransitionTimeout(),
    });
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.viewCarousel !== prevProps.viewCarousel) {
      if (this.state.carouselTimeout !== undefined) {
        clearTimeout(this.state.carouselTimeout);
      }
      this.setState({
        carouselLoopTime: this.getTotalCarouselTime(),
        carouselTimeout: this.createTransitionTimeout(),
      });
    }
  }

  public componentWillUnmount() {
    if (this.state.carouselTimeout !== undefined) {
      clearTimeout(this.state.carouselTimeout);
      this.setState({ carouselTimeout: undefined });
    }
  }

  public render() {
    if (!this.props.viewCarousel || this.props.viewCarousel.length === 0) {
      return <div>No carousel entries</div>;
    }

    const currentView = this.getCurrentView();

    return <View view={currentView} />;
  }

  public getTotalCarouselTime(): Seconds {
    return this.props.viewCarousel.reduce(
      (totalTime: Seconds, viewCarouselElement: IViewCarouselElement) =>
        totalTime + (viewCarouselElement.displaySeconds || 0),
      0,
    );
  }

  public getTimeToNextTransition(): Seconds {
    const redFunc = (timeAcc: Seconds, view: IViewCarouselElement) =>
      timeAcc >= 0 ? timeAcc - view.displaySeconds : timeAcc;

    const timeToTransition =
      -1 *
      this.props.viewCarousel.reduce(
        redFunc,
        (Date.now() / 1000) % this.state.carouselLoopTime,
      );
    return timeToTransition;
  }

  public createTransitionTimeout(): number | undefined {
    if (!this.state.carouselLoopTime) {
      return undefined;
    }
    const nextTransition = this.getTimeToNextTransition();
    return window.setTimeout(this.transition.bind(this), nextTransition * 1000);
  }

  public transition() {
    this.setState({
      carouselTimeout: this.createTransitionTimeout(),
    });
  }

  protected getCurrentView(): IViewBase {
    const redFunc = (
      {
        displayedViewCarouselElement,
        timeAcc,
      }: {
        displayedViewCarouselElement?: IViewCarouselElement;
        timeAcc: Seconds;
      },
      view: IViewCarouselElement,
    ) => ({
      displayedViewCarouselElement:
        timeAcc >= 0 ? view : displayedViewCarouselElement,
      timeAcc: timeAcc - view.displaySeconds,
    });

    const {
      displayedViewCarouselElement: foundDisplayedViewCarouselElement,
    }: {
      displayedViewCarouselElement?: IViewCarouselElement;
      timeAcc: Seconds;
    } = this.props.viewCarousel.reduce(redFunc, {
      displayedViewCarouselElement: undefined,
      timeAcc: (Date.now() / 1000) % this.state.carouselLoopTime,
    });

    return (
      foundDisplayedViewCarouselElement ||
      this.props.viewCarousel[0] ||
      {}
    ).view;
  }
}

export default ViewCarousel;
