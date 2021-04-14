<template>
  <div class="p-4">
    <div id="privacy-policy" class="p-5">
      <h1>PRIVACY NOTICE</h1>
      <p>Last updated April 13, 2021</p>
      <p>
        Thank you for choosing to be part of our community at Playlist Blender.
        We are committed to protecting your personal information and your right
        to privacy. If you have any questions or concerns about this privacy
        notice, or our practices with regards to your personal information,
        please contact us at ethanweiner20@gmail.com. When you visit our website
        https://playlistblender.com (the "Website"), and more generally, use any
        of our services (the "Services", which include the Website ), we
        appreciate that you are trusting us with your personal information. We
        take your privacy very seriously. In this privacy notice, we seek to
        explain to you in the clearest way possible what information we collect,
        how we use it and what rights you have in relation to it. We hope you
        take some time to read through it carefully, as it is important. If
        there are any terms in this privacy notice that you do not agree with,
        please discontinue use of our Services immediately. This privacy notice
        applies to all information collected through our Services (which, as
        described above, includes our Website ), as well as, any related
        services, sales, marketing or events. Please read this privacy notice
        carefully as it will help you understand what we do with the information
        that we collect.
      </p>
      <h3>TABLE OF CONTENTS</h3>
      <ol>
        <li><a href="#what">WHAT INFORMATION DO WE COLLECT?</a></li>
        <li><a href="#how">HOW DO WE USE YOUR INFORMATION?</a></li>
        <li>
          <a href="#share">WILL YOUR INFORMATION BE SHARED WITH ANYONE?</a>
        </li>
        <li><a href="#length">HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
        <li><a href="#safety">HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
        <li><a href="#apis">DISCLOSURE OF USE OF APIs</a></li>
        <li><a href="#controls">CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
        <li><a href="#updates">DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
        <li>
          <a href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>
        </li>
        <li>
          <a href="#review">
            HOW CAN YOU REVIEW, UPDATE OR DELETE THE DATA WE COLLECT FROM YOU?
          </a>
        </li>
      </ol>
      <h3 id="what">1. WHAT INFORMATION DO WE COLLECT?</h3>
      <p>In Short: We collect personal information that you provide to us.</p>
      <p>
        We collect personal information that you voluntarily provide to us when
        you express an interest in obtaining information about us or our
        products and Services, when you participate in activities on the Website
        or otherwise when you contact us. The personal information that we
        collect depends on the context of your interactions with us and the
        Website, the choices you make and the products and features you use. The
        personal information we collect may include the following:
      </p>
      <ul>
        <li>Personal Information Provided by You.</li>
      </ul>
      <p>
        We collect usernames; public and private playlist data; names of
        playlists; the number of items a playlist contains; and items contained
        within playlists.
      </p>
      <h3 id="how">2. HOW DO WE USE YOUR INFORMATION?</h3>
      <p>We use the information we collect or receive to:</p>
      <ul>
        <li>
          Input the tracks in a user's playlists to the blending algorithm
        </li>
        <li>
          Display an interactive user interface in which a user can view the
          name of their account, the names of the playlists in their account,
          and the number of items in these respective playlists
        </li>
        <li>
          Post a new playlist to the third-party account of the user's choice
        </li>
        <li>
          Post tracks to the playlist of the third-party account of the user's
          choice
        </li>
      </ul>
      <h3 id="share">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h3>
      <p>We do not, in any form, share your information with anyone.</p>
      <h3 id="length">4. HOW LONG DO WE KEEP YOUR INFORMATION?</h3>
      <p>
        In Short: We keep your information for as long as necessary to fulfill
        the purposes outlined in this privacy notice unless otherwise required
        by law.
      </p>
      <p>
        We do not store your information anywhere other than the local storage
        in your browser. We will only keep your personal information for as long
        as it is necessary for the purposes set out in this privacy notice,
        unless a longer retention period is required or permitted by law (such
        as tax, accounting or other legal requirements). No purpose in this
        notice will require us keeping your personal information for longer than
        1 hour, until you reintegrate any third party accounts with our website.
        When we have no ongoing legitimate business need to process your
        personal information, we will either delete or anonymize such
        information.
      </p>
      <h3 id="safety">5. HOW DO WE KEEP YOUR INFORMATION SAFE?</h3>
      <p>
        In Short: We aim to protect your personal information through a system
        of organizational and technical security measures.
      </p>
      <p>
        We have implemented appropriate technical and organizational security
        measures designed to protect the security of any personal information we
        process. However, despite our safeguards and efforts to secure your
        information, no electronic transmission over the Internet or information
        storage technology can be guaranteed to be 100% secure, so we cannot
        promise or guarantee that hackers, cybercriminals, or other unauthorized
        third parties will not be able to defeat our security, and improperly
        collect, access, steal, or modify your information. Although we will do
        our best to protect your personal information, transmission of personal
        information to and from our Website is at your own risk. You should only
        access the Website within a secure environment.
      </p>
      <h3 id="apis">6. DISCLOSURE OF USE OF APIs</h3>
      <p>
        We use APIs, specifically Youtube Data v3 API from Google, and the
        Spotify API, to:
      </p>
      <ul>
        <li>Gather basic account data</li>
        <li>Gather public and private playlist metadata</li>
        <li>Retrieve a list of items contained within specified playlists</li>
        <li>Create a new playlist on the account which you specify</li>
        <li>
          Add the items determined by the algorithm to the new playlist on the
          account which you specify (a maximum of 500 items will be added to the
          playlist)
        </li>
        <li>
          Search for items in the platform of the account you specify as the
          destination of your playlist
        </li>
      </ul>
      Listed below is a description of the specific scopes we request and how we
      use them to perform our service.
      <ul>
        <li>
          Our app will use
          <span class="font-weight-bold"
            >https://googleapis.com/auth/youtube.readonly</span
          >
          in order to gather basic account data, gather public and private
          playlist metadata, retrieve a list of items contained within specified
          playlists, and search for items in Youtube as our algorithm might
          require.
        </li>
        <li>
          Our app will use
          <span class="font-weight-bold"
            >https://googleapis.com/auth/youtube</span
          >
          in order to create the new playlist on a user's account (if you
          specify) and add the items retrieved by the algorithm to your
          playlists. A maximum of 500 items will be added to a user's playlist
          per use of our algorithm. We require access to this scope because in
          order to add playlists and playlist items to a user's account, we need
          to be able to directly modify the account. This scope grants the
          ability to do so.
        </li>
      </ul>
      <h3 id="controls">7. CONTROLS FOR DO-NOT-TRACK FEATURES</h3>
      <p>
        Most web browsers and some mobile operating systems and mobile
        applications include a Do-Not-Track ("DNT") feature or setting you can
        activate to signal your privacy preference not to have data about your
        online browsing activities monitored and collected. At this stage no
        uniform technology standard for recognizing and implementing DNT signals
        has been finalized. As such, we do not currently respond to DNT browser
        signals or any other mechanism that automatically communicates your
        choice not to be tracked online. If a standard for online tracking is
        adopted that we must follow in the future, we will inform you about that
        practice in a revised version of this privacy notice.
      </p>
      <h3 id="updates">8. DO WE MAKE UPDATES TO THIS NOTICE?</h3>
      <p>
        In Short: Yes, we will update this notice as necessary to stay compliant
        with relevant laws.
      </p>
      <p>
        We may update this privacy notice from time to time. The updated version
        will be indicated by an updated "Revised" date and the updated version
        will be effective as soon as it is accessible. If we make material
        changes to this privacy notice, we may notify you either by prominently
        posting a notice of such changes or by directly sending you a
        notification. We encourage you to review this privacy notice frequently
        to be informed of how we are protecting your information.
      </p>
      <h3 id="contact">9. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h3>
      <p>
        If you have questions or comments about this notice, you may email us at
        ethanweiner20@gmail.com
      </p>
      <h3 id="review">
        10. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
      </h3>
      <p>
        Based on the applicable laws of your country, you may have the right to
        request access to the personal information we collect from you, change
        that information, or delete it in some circumstances. We do not hold on
        to any of the data we collect from you, aside from storing it in local
        storage on your browser for at most 1 hour, until you reintegrate any
        third party accounts with our website. For more information, please
        email ethanweiner20@gmail.com.
      </p>
      <div>
        This privacy policy was created with the help of
        <a href="https://termly.io/products/privacy-policy-generator/?ftseo"
          >Termly’s Privacy Policy Generator</a
        >.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Privacy Policy",
};
</script>

<style lang="scss" scoped>
#privacy-policy {
  background: white;
}
h1,
h3,
p,
ul,
li,
a,
h5 {
  font-family: Arial !important;
  background: none !important;
  color: black !important;
}
</style>