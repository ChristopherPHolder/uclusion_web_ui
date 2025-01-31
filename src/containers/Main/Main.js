import React from 'react'
import config from '../../config'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/polyfill-locales'
import { withA2HS } from 'a2hs'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../toast.css';
import { LocaleProvider } from '../../contexts/LocaleContext'
import { NotificationsProvider } from '../../contexts/NotificationsContext/NotificationsContext'
import { MarketStagesProvider } from '../../contexts/MarketStagesContext/MarketStagesContext'
import { VersionsProvider } from '../../contexts/VersionsContext/VersionsContext'
import AppWithAuth from '../App/AppWithAuth'
import { OperationInProgressProvider } from '../../contexts/OperationInProgressContext/OperationInProgressContext'
import OperationInProgressGlobalProvider from '../../components/ContextHacks/OperationInProgressGlobalProvider'
import { DiffProvider } from '../../contexts/DiffContext/DiffContext'
import { AccountProvider } from '../../contexts/AccountContext/AccountContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { SearchIndexProvider } from '../../contexts/SearchIndexContext/SearchIndexContext'
import { SearchResultsProvider } from '../../contexts/SearchResultsContext/SearchResultsContext'
import { ScrollProvider } from '../../contexts/ScrollContext'
import { ExpandedCommentProvider } from '../../contexts/CommentsContext/ExpandedCommentContext'
import { NonParticipantsMarketsProvider } from '../../contexts/NonParticipantMarketsContext/NonParticipantMarketsContext'
import { TicketIndexProvider } from '../../contexts/TicketContext/TicketIndexContext'

function Main () {
  const stripePromise = loadStripe(config.payments.stripeKey);
  return (
    <div>
      <AccountProvider>
        <ExpandedCommentProvider>
          <TicketIndexProvider>
            <SearchIndexProvider>
              <SearchResultsProvider>
                <DiffProvider>
                  <OperationInProgressProvider>
                    <OperationInProgressGlobalProvider>
                      <VersionsProvider>
                        <ScrollProvider>
                          <NotificationsProvider>
                            <NonParticipantsMarketsProvider>
                              <MarketStagesProvider>
                                <LocaleProvider>
                                  <ToastContainer position="top-center" pauseOnFocusLoss={false}/>
                                  <Elements stripe={stripePromise}>
                                    <AppWithAuth/>
                                  </Elements>
                                </LocaleProvider>
                              </MarketStagesProvider>
                            </NonParticipantsMarketsProvider>
                          </NotificationsProvider>
                        </ScrollProvider>
                      </VersionsProvider>
                    </OperationInProgressGlobalProvider>
                  </OperationInProgressProvider>
                </DiffProvider>
              </SearchResultsProvider>
            </SearchIndexProvider>
          </TicketIndexProvider>
        </ExpandedCommentProvider>
      </AccountProvider>
    </div>
  );
}

export default withA2HS(Main);
